const usuario =
    JSON.parse(
        localStorage.getItem("usuario")
    );

if (usuario) {

    document.getElementById(
        "nombreNavbar"
    ).textContent =
        usuario.nombre;

    document.getElementById(
        "rolNavbar"
    ).textContent =
        usuario.rol;

    document.getElementById(
        "nombreTitulo"
    ).textContent =
        usuario.nombre;

    document.getElementById(
        "nombre"
    ).value =
        usuario.nombre;

    document.getElementById(
        "email"
    ).value =
        usuario.email;

    document.getElementById(
        "rol"
    ).value =
        usuario.rol;

}

document
    .getElementById("btnCancelar")
    .addEventListener("click", () => {

        window.location.href =
            "/dashboard-estudiante";

    });