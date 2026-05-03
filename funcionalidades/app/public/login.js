const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que la página se recargue por defecto

        // Obtenemos los valores de los inputs usando el atributo 'name'
        const formData = new FormData(e.target);
        const datos = Object.fromEntries(formData.entries());

        try {
            // Enviamos los datos al backend
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });

            // 🔥 AQUÍ ES DONDE VA TU CÓDIGO
            if (res.ok) {
                const data = await res.json();
                
                // Guardamos el token en el almacenamiento del navegador
                localStorage.setItem("token", data.token);

                alert("¡Inicio de sesión exitoso!");

                // Redirigimos al usuario a la ruta del dashboard
                window.location.href = "/dashboard"; 
            } else {
                // Si hay un error, lo mostramos en pantalla
                const errorData = await res.json();
                alert(errorData.message || "Error al iniciar sesión");
            }

        } catch (error) {
            console.error("Error de conexión:", error);
            alert("Ocurrió un error al conectar con el servidor.");
        }
    });
}