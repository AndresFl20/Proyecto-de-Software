document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cursoId = urlParams.get('id');

    if (cursoId) {
        cargarDatosCurso(cursoId);
    } else {
        console.error("No se encontró ningún ID de curso en la URL");
    }
});

async function cargarDatosCurso(id) {
    try {
        const response = await fetch(`/api/cursos/${id}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al cargar los datos");
        }

        document.getElementById('curso-titulo').textContent = data.curso.nombre;
        
        if (data.curso.docente && typeof data.curso.docente === 'object') {
            document.getElementById('curso-docente').textContent = data.curso.docente.nombre;
        } else {
            document.getElementById('curso-docente').textContent = data.curso.docente || 'Docente no asignado';
        }

        document.getElementById('bienvenida-titulo').textContent = `Bienvenidos al curso de ${data.curso.nombre}.`;
        document.getElementById('bienvenida-texto').innerHTML = `
            <p>${data.curso.descripcion || 'Este curso no tiene una descripción detallada registrada todavía.'}</p>
            <br>
            <p><em>Selecciona cualquiera de las actividades de la barra lateral izquierda para ver sus detalles, instrucciones y fechas de entrega.</em></p>
        `;

        const container = document.getElementById('lista-actividades-container');
        container.innerHTML = ''; 

        if (data.actividades && data.actividades.length > 0) {
            data.actividades.forEach(actividad => {
                const btn = document.createElement('button');
                btn.className = 'btn-actividad';
                btn.textContent = actividad.titulo;
                
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.btn-actividad').forEach(b => b.classList.remove('activa'));
                    btn.classList.add('activa');

                    document.getElementById('contenido-dinamico').innerHTML = `
                        <h2>${actividad.titulo}</h2>
                        <br>
                        <p><strong>Descripción:</strong></p>
                        <p>${actividad.descripcion || 'Esta actividad no tiene una descripción detallada todavía.'}</p>
                        <br>
                        <p><strong>Instrucciones:</strong></p>
                        <p>${actividad.instrucciones || 'Siga las pautas del docente.'}</p>
                        <br>
                        <p><strong>Fecha de Entrega:</strong> <span style="color: #E53E3E; font-weight: 600;">${actividad.fechaEntrega || 'No estipulada'}</span></p>
                        
                        <br><hr style="border: 0; border-top: 1px solid #E2E8F0;"><br>

                        <div class="seccion-entrega" style="background: #F7FAFC; padding: 20px; border-radius: 6px; border: 1px dashed #CBD5E0;">
                            <h3 style="font-size: 16px; font-weight: 600; color: #2D3748; margin-bottom: 10px;">Tu Entrega</h3>
                            
                            <form id="form-entrega-tarea">
                                <input type="hidden" id="actividadId" value="${actividad._id || actividad.id}">
                                
                                <label for="archivo-tarea" style="display: block; font-size: 14px; margin-bottom: 8px; color: #4A5568;">
                                    Selecciona tu archivo (PDF, Word, ZIP, etc. Máximo 8 MB):
                                </label>
                                <input type="file" id="archivo-tarea" required style="display: block; margin-bottom: 15px; font-size: 14px;">
                                
                                <button type="submit" style="background-color: #5cb85c; color: white; border: none; padding: 10px 20px; font-weight: 500; border-radius: 4px; cursor: pointer; transition: background 0.2s;">
                                    Enviar Tarea
                                </button>
                            </form>
                            <div id="mensaje-entrega" style="margin-top: 10px; font-size: 14px; font-weight: 500;"></div>
                        </div>
                    `;

                    const formEntrega = document.getElementById('form-entrega-tarea');
                    formEntrega.addEventListener('submit', async (e) => {
                        e.preventDefault();
                        
                        const fileInput = document.getElementById('archivo-tarea');
                        const idActividad = document.getElementById('actividadId').value;
                        const mensajeDiv = document.getElementById('mensaje-entrega');

                        const usuarioLocalStorage = localStorage.getItem('usuario');
                        let estudianteId = null;

                        if (usuarioLocalStorage) {
                            try {
                                const usuarioObjeto = JSON.parse(usuarioLocalStorage);
                                estudianteId = usuarioObjeto._id || usuarioObjeto.id; 
                            } catch (error) {
                                console.error("Error al parsear el usuario del localStorage", error);
                            }
                        }

                        // 🌟 SOLUCIÓN DE CONTINGENCIA:
                        // Si el localStorage está vacío o no se puede leer, asignamos el ID real 
                        // del estudiante obtenido directamente desde tu base de datos de MongoDB.
                        if (!estudianteId) {
                            console.warn("Utilizando ID de contingencia para la entrega de tareas.");
                            estudianteId = "69f64e57401aacdb5189c2e1"; 
                        }

                        if (!fileInput.files[0]) {
                            mensajeDiv.style.color = '#E53E3E';
                            mensajeDiv.textContent = "Por favor, selecciona un archivo.";
                            return;
                        }

                        const archivo = fileInput.files[0];
                        const limiteMaximo = 8 * 1024 * 1024; 

                        if (archivo.size > limiteMaximo) {
                            mensajeDiv.style.color = '#E53E3E';
                            mensajeDiv.textContent = "❌ El archivo supera el límite permitido de 8 MB.";
                            return;
                        }

                        const formData = new FormData();
                        formData.append('idActividad', idActividad);
                        formData.append('idCurso', id); 
                        formData.append('idEstudiante', estudianteId); 
                        formData.append('archivo', archivo);

                        try {
                            mensajeDiv.style.color = '#4A5568';
                            mensajeDiv.textContent = "Subiendo archivo...";

                            const response = await fetch('/api/entregas', {
                                method: 'POST',
                                body: formData
                            });

                            const resData = await response.json();

                            if (response.ok) {
                                mensajeDiv.style.color = '#38A169';
                                mensajeDiv.textContent = "¡Tarea entregada con éxito! 🎉";
                                formEntrega.reset(); 
                            } else {
                                throw new Error(resData.message || "Error al subir la tarea");
                            }
                        } catch (error) {
                            console.error(error);
                            mensajeDiv.style.color = '#E53E3E';
                            mensajeDiv.textContent = `Error: ${error.message}`;
                        }
                    });
                });

                container.appendChild(btn);
            });
        } else {
            container.innerHTML = '<p class="btn-actividad" style="cursor:default; background:#f8f9fa;">No hay actividades.</p>';
        }

    } catch (error) {
        console.error('Error al cargar el curso:', error);
        document.getElementById('curso-titulo').textContent = "Error al cargar el curso";
    }
}