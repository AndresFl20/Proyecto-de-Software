if (typeof loginForm === 'undefined') {
    var loginForm = document.getElementById('login-form');
}

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

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);

                const usuarioCompleto = data.user || {};

                try {
                    const payloadBase64 = data.token.split('.')[1];
                    const payloadDecodificado = JSON.parse(atob(payloadBase64));
                    
                    usuarioCompleto._id = payloadDecodificado.id || payloadDecodificado._id;
                    
                    console.log("¡ID recuperado con éxito del Token!", usuarioCompleto._id);
                } catch (tokenError) {
                    console.error("No se pudo decodificar el token:", tokenError);
                }

                localStorage.setItem("usuario", JSON.stringify(usuarioCompleto));

                alert("¡Inicio de sesión exitoso! 🎉");

                window.location.href = "/dashboard-estudiante";
            } else {
                alert(data.message || "Credenciales incorrectas. Inténtalo de nuevo.");
            }

        } catch (error) {
            console.error("Error de conexión:", error);
            alert("Ocurrió un error al conectar con el servidor.");
        }
    });
}