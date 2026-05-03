document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("register-form");

    if (!form) {
        console.error("Error: No se encontró el formulario con el id 'register-form'. Revisa tu HTML.");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const url = "http://localhost:4000/api/registro"; 

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre: e.target.nombre.value, 
                    email: e.target.email.value,
                    password: e.target.password.value,
                    rol: e.target.rol.value
                })
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("Error del servidor:", data);
                alert(data.message || "Ocurrió un error al registrarse. Intenta de nuevo.");
                return;
            }

            console.log("Registro exitoso:", data);
            alert("¡Registro exitoso! Ya puedes iniciar sesión.");
            e.target.reset(); // Limpia el formulario

        } catch (error) {
            console.error("Error de conexión:", error);
            alert("No se pudo conectar al servidor. Revisa tu conexión.");
        }
    });
});