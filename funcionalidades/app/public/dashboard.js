const usuario = JSON.parse(localStorage.getItem("usuario"));

const rolUsuario = usuario?.rol?.toLowerCase() || "estudiante";
const usuarioId = usuario?._id || usuario?.id;

if (usuario) {
    if(document.getElementById("nombreUsuario")) document.getElementById("nombreUsuario").textContent = usuario.nombre;
    if(document.getElementById("rolUsuario")) document.getElementById("rolUsuario").textContent = usuario.rol;
}

const contenedor = document.getElementById("contenedorCursos");
const buscador = document.getElementById("buscarCurso");
const filtroEstado = document.getElementById("filtroEstado");

let cursosCargados = [];

function aplicarFiltros() {
    const texto = buscador.value.toLowerCase();
    const estado = filtroEstado.value.toLowerCase();

    const filtrados = cursosCargados.filter(item => {
        const curso = rolUsuario === "docente" ? item : item.curso;
        
        if (!curso) return false;

        const coincideNombre = curso.nombre.toLowerCase().includes(texto);
        const coincideEstado = estado === "" || curso.estado.toLowerCase() === estado;

        return (coincideNombre && coincideEstado);
    });

    mostrarCursos(filtrados);
}

function mostrarCursos(listaCursos) {
    contenedor.innerHTML = "";

    if (listaCursos.length === 0) {
        contenedor.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #A0AEC0; font-style: italic; padding: 20px;">No se encontraron asignaturas.</p>`;
        return;
    }

    listaCursos.forEach(item => {
        const curso = rolUsuario === "docente" ? item : item.curso;
        const progresoHTML = rolUsuario === "docente" 
            ? `<p class="progreso">👨‍🏫 Rol: Profesor Titular</p>` 
            : `<p class="progreso">${item.progreso || 0}% Completado</p>`;
            
        const nombreDocente = rolUsuario === "docente" 
            ? usuario.nombre 
            : (curso.docente?.nombre || curso.docente || "No asignado");

        contenedor.innerHTML += `
        <div class="curso-card" data-id="${curso._id || curso.id}" style="cursor: pointer;">
            <img src="${curso.imagen || 'https://via.placeholder.com/300x150'}" alt="${curso.nombre}">
            <div class="info-curso">
                <h2>${curso.nombre}</h2>
                <p class="docente">Prof: ${nombreDocente}</p>
                ${progresoHTML}
                <p class="estado">Estado: ${curso.estado || 'Activo'}</p>
            </div>
        </div>
        `;
    });

    const tarjetas = document.querySelectorAll(".curso-card");
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener("click", () => {
            const cursoId = tarjeta.getAttribute("data-id");
            window.location.href = `/curso-detalle?id=${cursoId}`;
        });
    });
}

async function cargarCursos() {
    try {
        let rutaFetch = "/api/mis-cursos"; 
        
        if (rolUsuario === "docente") {
            rutaFetch = `/api/cursos/docente/${usuarioId}`;
        }

        const respuesta = await fetch(rutaFetch);
        if (!respuesta.ok) throw new Error("Error en la respuesta del servidor");
        
        const datos = await respuesta.json();
        
        // 🌟 CORRECCIÓN CLAVE: Mapeo exacto de la respuesta según el rol
        cursosCargados = rolUsuario === "docente" ? (datos.cursos || []) : datos;
        
        // 🌟 ACTUALIZAR BIENVENIDA: Cambiamos los textos dinámicamente en pantalla
        const saludo = document.getElementById("saludo-bienvenida");
        const descripcion = document.getElementById("descripcion-bienvenida");

        if (saludo && descripcion) {
            if (rolUsuario === "docente") {
                saludo.textContent = `¡Bienvenido, Prof. ${usuario.nombre.split(" ")[0]}! 👨‍🏫`;
                descripcion.textContent = "Aquí tienes el control de tus asignaturas y grupos a cargo.";
            } else {
                saludo.textContent = `¡Hola, ${usuario.nombre.split(" ")[0]}! 🎓`;
                descripcion.textContent = "Explora tus materias y revisa tus actividades pendientes.";
            }
        }

        mostrarCursos(cursosCargados);
    } catch (error) {
        console.error("Error cargando los cursos en el dashboard:", error);
        contenedor.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #E53E3E;">No se pudieron cargar tus asignaturas.</p>`;
    }
}

if (buscador) buscador.addEventListener("input", aplicarFiltros);
if (filtroEstado) filtroEstado.addEventListener("change", aplicarFiltros);

const campana = document.getElementById("campana");
const panel = document.getElementById("panelNotificaciones");
const lista = document.getElementById("listaNotificaciones");

if (lista) {
    const notificaciones = rolUsuario === "docente" ? [
        { mensaje: "Actividad 6: Hay 5 nuevas entregas por calificar" },
        { mensaje: "Coordinación: Recordatorio de subir notas parciales" }
    ] : [
        { mensaje: "Matemáticas Básicas: María Rodríguez calificó tu actividad" },
        { mensaje: "Desarrollo Web: se agregaron nuevas actividades" }
    ];

    lista.innerHTML = notificaciones
        .map(n => `<div class="notificacion" style="padding: 10px; border-bottom: 1px solid #EDF2F7; font-size: 13px;">${n.mensaje}</div>`)
        .join("");
}

if (campana && panel) {
    campana.addEventListener("click", () => {
        panel.style.display = panel.style.display === "block" ? "none" : "block";
    });
}

document.getElementById("perfilUsuario")?.addEventListener("click", () => window.location.href = "/perfil");
document.getElementById("fotoUsuario")?.addEventListener("click", () => window.location.href = "/perfil");

cargarCursos();