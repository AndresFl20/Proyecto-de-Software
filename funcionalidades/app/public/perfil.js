document.addEventListener("DOMContentLoaded", () => {
    const usuarioLogueado = JSON.parse(localStorage.getItem("usuario"));

    if (usuarioLogueado) {

        if (document.getElementById("nombre")) document.getElementById("nombre").value = usuarioLogueado.nombre;
        if (document.getElementById("email")) document.getElementById("email").value = usuarioLogueado.email;
        if (document.getElementById("rol")) document.getElementById("rol").value = usuarioLogueado.rol;
        if (document.getElementById("nombreTitulo")) document.getElementById("nombreTitulo").textContent = usuarioLogueado.nombre;


        if (document.getElementById("nombreNavbar")) {
            document.getElementById("nombreNavbar").textContent = usuarioLogueado.nombre;
        }
        if (document.getElementById("rolNavbar")) {
            document.getElementById("rolNavbar").textContent = usuarioLogueado.rol;
        }

        const rutaImagen = usuarioLogueado.imagen || "/img/default.jpg";

        if (document.getElementById("fotoPerfil")) {
            document.getElementById("fotoPerfil").src = rutaImagen;
        }
        if (document.getElementById("fotoNavbar")) {
            document.getElementById("fotoNavbar").src = rutaImagen;
        }
    }

    const listaNotificaciones = document.getElementById("listaNotificaciones");
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

let imagenBase64 = "";

if (document.getElementById("nuevaFoto")) {
    document.getElementById("nuevaFoto").addEventListener("change", (e) => {
        const archivo = e.target.files[0];
        if (archivo) {
            const reader = new FileReader();
            reader.onload = function (event) {
                if (document.getElementById("fotoPerfil")) {
                    document.getElementById("fotoPerfil").src = event.target.result;
                }
                imagenBase64 = event.target.result;
            };
            reader.readAsDataURL(archivo);
        }
    });
}

if (document.getElementById("btnGuardar")) {
    document.getElementById("btnGuardar").addEventListener("click", async () => {
        const nombre = document.getElementById("nombre").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password && password !== confirmPassword) {
            alert("Las contraseñas nuevas no coinciden.");
            return;
        }

        const datosActualizados = { nombre, email, password };

        if (imagenBase64 !== "") {
            datosActualizados.imagen = imagenBase64;
        }

        try {
            const respuesta = await fetch("/api/usuarios/actualizar", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosActualizados)
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                localStorage.setItem("usuario", JSON.stringify(resultado.usuario));
                localStorage.setItem("mostrarAlertaPerfil", "true");
                window.location.href = "/dashboard-estudiante";
            } else {
                alert("Error al actualizar: " + resultado.mensaje);
            }
        } catch (error) {
            console.error("Error en la conexión con el servidor:", error);
            alert("Hubo un error de red al intentar actualizar.");
        }
    });
}

if (document.getElementById("btnCancelar")) {
    document.getElementById("btnCancelar").addEventListener("click", () => {
        window.location.href = "/dashboard-estudiante";
    });
}

const campana = document.getElementById("campana");
const panelNotificaciones = document.getElementById("panelNotificaciones");

if (campana && panelNotificaciones) {
    campana.addEventListener("click", (e) => {
        e.stopPropagation();
        const estaOculto = window.getComputedStyle(panelNotificaciones).display === "none";
        panelNotificaciones.style.display = estaOculto ? "block" : "none";
    });

    document.addEventListener("click", () => {
        panelNotificaciones.style.display = "none";
    });

    panelNotificaciones.addEventListener("click", (e) => {
        e.stopPropagation();
    });
}