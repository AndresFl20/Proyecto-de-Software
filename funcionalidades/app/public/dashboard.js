const contenedor =
document.getElementById("contenedorCursos");

async function cargarCursos() {

    const respuesta =
    await fetch("/api/mis-cursos");

    const inscripciones =
    await respuesta.json();

    contenedor.innerHTML = "";

    inscripciones.forEach(inscripcion => {

        contenedor.innerHTML += `

        <div class="curso-card">

            <img
                src="${inscripcion.curso.imagen}"
                alt="${inscripcion.curso.nombre}"
            >

            <div class="info-curso">

                <h2>${inscripcion.curso.nombre}</h2>

               <p class="docente">
                    ${inscripcion.curso.docente.nombre}
               </p>

                <p class="progreso">
                    ${inscripcion.progreso}% Completado
                </p>

            </div>

        </div>

        `;
    });
}

cargarCursos();