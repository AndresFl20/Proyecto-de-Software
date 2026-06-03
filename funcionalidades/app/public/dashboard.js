const usuario = JSON.parse(localStorage.getItem("usuario"));

if (usuario) {
    document.getElementById("nombreUsuario").textContent = usuario.nombre;
    document.getElementById("rolUsuario").textContent = usuario.rol;
    
    if (usuario.imagen) {
        document.getElementById("fotoUsuario").src = usuario.imagen;
    }
}

const contenedor = document.getElementById("contenedorCursos");
const buscador = document.getElementById("buscarCurso");
const filtroEstado = document.getElementById("filtroEstado");

let cursosCargados = [];

function aplicarFiltros() {
    const texto = buscador.value.toLowerCase();
    const estado = filtroEstado.value.toLowerCase();

    const filtrados = cursosCargados.filter(inscripcion => {
        const coincideNombre = inscripcion.curso.nombre
            .toLowerCase()
            .includes(texto);

        const coincideEstado = estado === "" ||
            inscripcion.curso.estado
                .toLowerCase() === estado;

        return (coincideNombre && coincideEstado);
    });

    mostrarCursos(filtrados);
}

function mostrarCursos(cursos) {
    contenedor.innerHTML = "";

    cursos.forEach(inscripcion => {
        contenedor.innerHTML += `
        <div class="curso-card" data-id="${inscripcion.curso._id}" style="cursor: pointer;">
            <img src="${inscripcion.curso.imagen}" alt="${inscripcion.curso.nombre}">
            <div class="info-curso">
                <h2>${inscripcion.curso.nombre}</h2>
                <p class="docente">${inscripcion.curso.docente.nombre}</p>
                <p class="progreso">${inscripcion.progreso}% Completado</p>
                <p class="estado">Estado: ${inscripcion.curso.estado}</p>
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
        const respuesta = await fetch("/api/mis-cursos");
        const inscripciones = await respuesta.json();
        cursosCargados = inscripciones;
        mostrarCursos(cursosCargados);
    } catch (error) {
        console.error("Error al cargar los cursos desde el servidor:", error);
    }
}

buscador.addEventListener("input", aplicarFiltros);
filtroEstado.addEventListener("change", aplicarFiltros);

const campana = document.getElementById("campana");
const panel = document.getElementById("panelNotificaciones");
const lista = document.getElementById("listaNotificaciones");

const notificaciones = [
    { mensaje: "Matemáticas Básicas: María Rodríguez calificó tu actividad" },
    { mensaje: "Desarrollo Web: se agregaron nuevas actividades" },
    { mensaje: "Bases de Datos: nueva tarea disponible" }
];

lista.innerHTML = notificaciones
    .map(n => `<div class="notificacion">${n.mensaje}</div>`)
    .join("");

campana.addEventListener("click", () => {
    if (panel.style.display === "block") {
        panel.style.display = "none";
    } else {
        panel.style.display = "block";
    }
});

document.getElementById("perfilUsuario")?.addEventListener("click", () => {
    window.location.href = "/perfil";
});

document.getElementById("fotoUsuario")?.addEventListener("click", () => {
    window.location.href = "/perfil";
});

document.addEventListener("DOMContentLoaded", () => {
    const alerta = document.getElementById("alertaPerfil");

    if (localStorage.getItem("mostrarAlertaPerfil") === "true") {
        if (alerta) {
            alerta.style.display = "flex";

            localStorage.removeItem("mostrarAlertaPerfil");

            setTimeout(() => {
                alerta.style.transition = "opacity 0.5s ease";
                alerta.style.opacity = "0";

                setTimeout(() => {
                    alerta.style.display = "none";
                    alerta.style.opacity = "1";
                }, 500);

            }, 4000);
        }
    }
});

cargarCursos();