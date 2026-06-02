const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const datos = Object.fromEntries(formData.entries());

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });

            if (res.ok) {

                const data = await res.json();

                localStorage.setItem(
                    "token",
                    data.token
                );

                localStorage.setItem(
                    "usuario",
                    JSON.stringify(data.user)
                );

                alert("¡Inicio de sesión exitoso!");

                window.location.href =
                    "/dashboard-estudiante";
            }

        } catch (error) {
            console.error("Error de conexión:", error);
            alert("Ocurrió un error al conectar con el servidor.");
        }
    });
}