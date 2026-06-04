document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) { window.location.href = "/"; return; }

    // Convertimos a minúsculas para evaluar de manera limpia
    const rolUsuario = usuario?.rol?.toLowerCase() || "estudiante";
    
    // Aseguramos capturar el ID con guión bajo que es como está en tu LocalStorage (_id)
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

    // Lógica del menú de usuario
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
            window.location.href = "/"; 
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

    const fotoClickable = document.getElementById("fotoUsuario");
    const nombreClickable = document.getElementById("nombreUsuario");

    if (fotoClickable) {
        fotoClickable.style.cursor = "pointer";
        fotoClickable.title = "Editar Perfil";
        fotoClickable.addEventListener("click", () => {
            window.location.href = "/perfil"; 
        });
    }

    if (nombreClickable) {
        nombreClickable.style.cursor = "pointer";
        nombreClickable.title = "Editar Perfil";
        nombreClickable.addEventListener("click", () => {
            window.location.href = "/perfil"; 
        });
    }

    const contenedor = document.getElementById("contenedorCursos");
    const buscador = document.getElementById("buscarCurso");
    const filtroEstado = document.getElementById("filtroEstado");
    let cursosCargados = [];

    buscador?.addEventListener("input", aplicarFiltros);
    filtroEstado?.addEventListener("change", aplicarFiltros);


    async function cargarCursos() {
        try {
            if (contenedor) contenedor.innerHTML = "<p>Cargando asignaturas...</p>";

            let url = "";
            // Validación robusta que cubre tanto "docente" como "profesor"
            if (rolUsuario.includes("docente") || rolUsuario.includes("profesor")) {
                url = `/api/cursos/docente/${usuarioId}`;
            } else {
                url = `/api/cursos/estudiante/${usuarioId}`;
            }

            console.log("Consultando cursos en la URL:", url); // Verifica esto en F12 -> Console

            const response = await fetch(url);
            const data = await response.json();

            // Mapeo seguro para extraer el array de cursos
            if (data && data.cursos && Array.isArray(data.cursos)) {
                cursosCargados = data.cursos;
            } else if (Array.isArray(data)) {
                cursosCargados = data;
            } else {
                cursosCargados = [];
            }

            dibujarCursos(cursosCargados);

        } catch (error) {
            console.error("Error al cargar cursos:", error);
            if (contenedor) contenedor.innerHTML = "<p>Error al conectar con el servidor.</p>";
        }
    }

    function dibujarCursos(listaCursos) {
        if (!contenedor) return;
        contenedor.innerHTML = "";

        if (!listaCursos || listaCursos.length === 0) {
            contenedor.innerHTML = "<p class='no-cursos'>No se encontraron asignaturas.</p>";
            return;
        }

        listaCursos.forEach(curso => {
            if (!curso) return;

            // Creamos el div contenedor con la clase exacta de tu CSS
            const tarjeta = document.createElement("div");
            tarjeta.className = "curso-card"; 

            // Validamos si el curso trae imagen, si no ponemos una por defecto de libros/estudios
            const imagenCurso = curso.imagen || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=240&h=150&auto=format&fit=crop";
            
            // Obtenemos el nombre del docente si viene poblado desde el backend, o usamos uno genérico
            const nombreDocente = curso.docente?.nombre || "Docente Asignado";
            
            // Rescatamos el progreso numérico (si no viene, por defecto marcamos 0)
            const porcentajeProgreso = curso.progreso !== undefined ? curso.progreso : 0;

            tarjeta.innerHTML = `
                <img src="${imagenCurso}" alt="${curso.nombre || 'Curso'}">
                <div class="info-curso" onclick="window.location.href='/curso-detalle?id=${curso._id || curso.id}'" style="cursor: pointer;">
                    <h2>${curso.nombre || "Asignatura sin nombre"}</h2>
                    <div class="docente">${nombreDocente}</div>
                    <div class="progreso">${porcentajeProgreso}% Completado</div>
                </div>
            `;
            
            contenedor.appendChild(tarjeta);
        });
    }

    function aplicarFiltros() {
        const texto = buscador?.value.toLowerCase() || "";
        const estado = filtroEstado?.value || "Todos los estados";

        const filtrados = cursosCargados.filter(curso => {
            if (!curso) return false;
            const cumpleTexto = curso.nombre?.toLowerCase().includes(texto);
            const cumpleEstado = (estado === "Todos los estados" || curso.estado === estado);
            return cumpleTexto && cumpleEstado;
        });

        dibujarCursos(filtrados);
    }

    // Arrancamos la carga inicial de cursos al abrir la página
    cargarCursos();
});

document.addEventListener("DOMContentLoaded", () => {
    const campana = document.getElementById("campana");
    const panelNotificaciones = document.getElementById("panelNotificaciones");
    const listaNotificaciones = document.getElementById("listaNotificaciones");

    // 1. Alternar (abrir/cerrar) el panel al dar clic en la campana
    if (campana && panelNotificaciones) {
        campana.addEventListener("click", (e) => {
            e.stopPropagation(); // Evita que se cierre inmediatamente al propagar el clic
            panelNotificaciones.classList.toggle("mostrar");
        });

        // Cerrar el panel automáticamente si el usuario hace clic en cualquier otra parte de la pantalla
        document.addEventListener("click", () => {
            panelNotificaciones.classList.remove("mostrar");
        });
    }

    // 2. Inyectar las notificaciones quemadas del compañero
    if (listaNotificaciones) {
        const notificacionesQuemadas = [
            "Tienes un nuevo mensaje del docente.",
            "Tu entrega de 'Proyecto Final' ha sido calificada.",
            "Nueva actividad disponible en el curso de Diseño Web."
        ];

        listaNotificaciones.innerHTML = "";
        notificacionesQuemadas.forEach(texto => {
            const div = document.createElement("div");
            div.className = "notificacion";
            div.textContent = texto;
            listaNotificaciones.appendChild(div);
        });
    }
});