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

    const btnMenu = document.getElementById("btnMenuUsuario");
    const menuUsuario = document.getElementById("menuUsuario");
    const btnCerrarSesion = document.getElementById("cerrarSesion");
    const campana = document.getElementById("campana");
    const panelNotificaciones = document.getElementById("panelNotificaciones");

    if (btnMenu && menuUsuario) {
        btnMenu.addEventListener("click", (e) => {
            e.stopPropagation();
            if (panelNotificaciones) panelNotificaciones.style.display = "none";
            const estaOculto = window.getComputedStyle(menuUsuario).display === "none";
            menuUsuario.style.display = estaOculto ? "block" : "none";
        });
    }

    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", () => {
            localStorage.clear();
            window.location.href = "/login";
        });
    }

    if (campana && panelNotificaciones) {
        campana.addEventListener("click", (e) => {
            e.stopPropagation();
            if (menuUsuario) menuUsuario.style.display = "none";
            const estaOculto = window.getComputedStyle(panelNotificaciones).display === "none";
            panelNotificaciones.style.display = estaOculto ? "block" : "none";
        });
    }

    document.addEventListener("click", () => {
        if (menuUsuario) menuUsuario.style.display = "none";
        if (panelNotificaciones) panelNotificaciones.style.display = "none";
    });

    if (menuUsuario) menuUsuario.addEventListener("click", (e) => e.stopPropagation());
    if (panelNotificaciones) panelNotificaciones.addEventListener("click", (e) => e.stopPropagation());

    const contenedor = document.getElementById("contenedorCursos");
    const buscador = document.getElementById("buscarCurso");
    const filtroEstado = document.getElementById("filtroEstado");
    let cursosCargados = [];

    buscador?.addEventListener("input", aplicarFiltros);
    filtroEstado?.addEventListener("change", aplicarFiltros);

    cargarCursos();
});