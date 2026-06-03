document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) { window.location.href = "/"; return; }

    const rolUsuario = usuario?.rol?.toLowerCase() || "estudiante";
    const usuarioId = usuario?._id || usuario?.id;

    if (document.getElementById("nombreUsuario")) document.getElementById("nombreUsuario").textContent = usuario.nombre;
    if (document.getElementById("rolUsuario")) document.getElementById("rolUsuario").textContent = usuario.rol;
    if (usuario.imagen && document.getElementById("fotoUsuario")) {
        document.getElementById("fotoUsuario").src = usuario.imagen;
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
            const coincideEstado = estado === "" || (curso.estado || 'activo').toLowerCase() === estado;
            return (coincideNombre && coincideEstado);
        });
        mostrarCursos(filtrados);
    }

    function mostrarCursos(listaCursos) {
        contenedor.innerHTML = "";
        if (listaCursos.length === 0) {
            contenedor.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #A0AEC0; font-style: italic;">No se encontraron asignaturas.</p>`;
            return;
        }

        listaCursos.forEach(item => {
            const curso = rolUsuario === "docente" ? item : item.curso;
            const progresoHTML = rolUsuario === "docente" 
                ? `<p class="progreso">👨‍🏫 Profesor Titular</p>` 
                : `<p class="progreso">${item.progreso || 0}% Completado</p>`;
            
            const nombreDocente = rolUsuario === "docente" ? usuario.nombre : (curso.docente?.nombre || "No asignado");

            contenedor.innerHTML += `
            <div class="curso-card" data-id="${curso._id}" style="cursor: pointer;">
                <img src="${curso.imagen || 'https://via.placeholder.com/300x150'}" alt="${curso.nombre}">
                <div class="info-curso">
                    <h2>${curso.nombre}</h2>
                    <p class="docente">Prof: ${nombreDocente}</p>
                    ${progresoHTML}
                    <p class="estado">Estado: ${curso.estado || 'Activo'}</p>
                </div>
            </div>`;
        });

        document.querySelectorAll(".curso-card").forEach(tarjeta => {
            tarjeta.addEventListener("click", () => window.location.href = `/curso-detalle?id=${tarjeta.dataset.id}`);
        });
    }

    async function cargarCursos() {
        try {
            const ruta = rolUsuario === "docente" ? `/api/cursos/docente/${usuarioId}` : "/api/mis-cursos";
            const respuesta = await fetch(ruta);
            const datos = await respuesta.json();
            cursosCargados = rolUsuario === "docente" ? (datos.cursos || []) : datos;
            
            const saludo = document.getElementById("saludo-bienvenida");
            if (saludo) saludo.textContent = rolUsuario === "docente" ? `¡Bienvenido, Prof. ${usuario.nombre.split(" ")[0]}!` : `¡Hola, ${usuario.nombre.split(" ")[0]}!`;
            
            mostrarCursos(cursosCargados);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const campana = document.getElementById("campana");
    const panel = document.getElementById("panelNotificaciones");
    if (campana && panel) {
        campana.addEventListener("click", () => panel.style.display = panel.style.display === "block" ? "none" : "block");
    }

    const alerta = document.getElementById("alertaPerfil");
    if (alerta && localStorage.getItem("mostrarAlertaPerfil") === "true") {
        alerta.style.display = "flex";
        localStorage.removeItem("mostrarAlertaPerfil");
        setTimeout(() => alerta.style.display = "none", 4000);
    }

    buscador?.addEventListener("input", aplicarFiltros);
    filtroEstado?.addEventListener("change", aplicarFiltros);
    document.getElementById("perfilUsuario")?.addEventListener("click", () => window.location.href = "/perfil");
    document.getElementById("fotoUsuario")?.addEventListener("click", () => window.location.href = "/perfil");

    cargarCursos();
});