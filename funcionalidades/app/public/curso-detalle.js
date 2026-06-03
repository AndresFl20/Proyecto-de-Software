document.addEventListener('DOMContentLoaded', () => {
    cargarDatosUsuarioNavbar();

    const urlParams = new URLSearchParams(window.location.search);
    const cursoId = urlParams.get('id');

    if (cursoId) {
        cargarDatosCurso(cursoId);
    } else {
        console.error("No se encontró ningún ID de curso en la URL");
    }
});

function cargarDatosUsuarioNavbar() {
    const usuarioLocalStorage = localStorage.getItem('usuario');
    if (usuarioLocalStorage) {
        try {
            const user = JSON.parse(usuarioLocalStorage);
            const nombreEl = document.getElementById('nombreUsuario');
            const rolEl = document.getElementById('rolUsuario');

            if (nombreEl) nombreEl.textContent = user.nombre || "Usuario";
            if (rolEl) rolEl.textContent = user.rol || "Estudiante";
        } catch (e) {
            console.error("Error al cargar datos del usuario en navbar:", e);
        }
    }
}

function cargarDatosUsuarioNavbar() {
    const usuarioLocalStorage = localStorage.getItem('usuario');
    if (usuarioLocalStorage) {
        try {
            const user = JSON.parse(usuarioLocalStorage);
            console.log("Datos del usuario:", user); // <--- MIRA LA CONSOLA (F12)

            const nombreEl = document.getElementById('nombreUsuario');
            const rolEl = document.getElementById('rolUsuario');
            const fotoEl = document.getElementById('fotoUsuario');

            if (nombreEl) nombreEl.textContent = user.nombre || "Usuario";
            if (rolEl) rolEl.textContent = user.rol || "Estudiante";
            
            const urlFoto = user.foto || user.imagen || user.urlFoto || user.avatar;

            if (fotoEl && urlFoto) {
                fotoEl.src = urlFoto; 
            }
        } catch (e) {
            console.error("Error al cargar datos del usuario en navbar:", e);
        }
    }
}

async function renderizarDetalleActividad(actividad, cursoId) {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario || !usuario._id) {
        alert("Error: No se detectó sesión activa.");
        return;
    }

    document.querySelectorAll('.btn-actividad').forEach(b => b.classList.remove('activa'));
    event.target.classList.add('activa');

    let entregaRealizada = null;
    try {
        const checkRes = await fetch(`/api/entregas/verificar/${actividad._id || actividad.id}/${usuario._id}`);
        const checkData = await checkRes.json();
        if (checkRes.ok && checkData.entregado) entregaRealizada = checkData.entrega;
    } catch (e) { console.error(e); }

    const contenedor = document.getElementById('contenido-dinamico');

    let html = `
        <h2>${actividad.titulo}</h2>
        <p><strong>Descripción:</strong> ${actividad.descripcion}</p>
        <p><strong>Fecha límite:</strong> ${actividad.fechaEntrega}</p>
        <hr>
    `;

    if (entregaRealizada) {
        html += `
            <div style="background:#38A169; color:white; padding:15px; border-radius:5px;">
                <strong>¡Ya has entregado esta actividad!</strong>
                <p>Archivo: ${entregaRealizada.nombreArchivo}</p>
            </div>
        `;
    } else {
        html += `
            <form id="form-entrega">
                <input type="file" id="archivo-tarea" required>
                <button type="submit">🚀 Enviar Tarea</button>
            </form>
            <div id="mensaje-entrega"></div>
        `;
    }

    contenedor.innerHTML = html;

    if (!entregaRealizada) {
        document.getElementById('form-entrega').onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append('archivo', document.getElementById('archivo-tarea').files[0]);
            formData.append('idActividad', actividad._id);
            formData.append('idCurso', cursoId);
            formData.append('idEstudiante', usuario._id);

            const res = await fetch('/api/entregas', { method: 'POST', body: formData });
            if (res.ok) {
                alert("Entrega enviada con éxito");
                renderizarDetalleActividad(actividad, cursoId); // Recargar
            }
        };
    }
}