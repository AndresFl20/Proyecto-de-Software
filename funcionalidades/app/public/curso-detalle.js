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
                
                btn.addEventListener('click', async () => {
                    document.querySelectorAll('.btn-actividad').forEach(b => b.classList.remove('activa'));
                    btn.classList.add('activa');

                    // 1. Obtener ID del estudiante
                    const usuarioLocalStorage = localStorage.getItem('usuario');
                    let estudianteId = "69f64e57401aacdb5189c2e1"; 
                    if (usuarioLocalStorage) {
                        try {
                            const usuarioObjeto = JSON.parse(usuarioLocalStorage);
                            estudianteId = usuarioObjeto._id || usuarioObjeto.id || estudianteId;
                        } catch (e) {
                            console.error("Error parseando usuario:", e);
                        }
                    }

                    // 2. Consultar al backend si ya existe una entrega
                    let entregaRealizada = false;
                    let datosEntrega = null;

                    try {
                        const checkRes = await fetch(`/api/entregas/verificar/${actividad._id || actividad.id}/${estudianteId}`);
                        const checkData = await checkRes.json();
                        if (checkRes.ok && checkData.entregado) {
                            entregaRealizada = true;
                            datosEntrega = checkData.entrega;
                        }
                    } catch (err) {
                        console.error("Error comprobando estado de entrega:", err);
                    }

                    // 3. Estructura base de la actividad
                    let contenidoHTML = `
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
                    `;

                    // 4. Renderizado condicional según el estado en la Base de Datos
                    if (entregaRealizada) {
                        // Insertamos la alerta con una transición CSS de opacidad configurada
                        document.getElementById('contenido-dinamico').innerHTML = `
                            <div id="alerta-temporal" style="background-color: #38A169; color: white; padding: 15px; border-radius: 4px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; font-weight: 500; transition: opacity 0.5s ease; opacity: 1;">
                                <span style="font-size: 20px;">✓</span>
                                <div>
                                    <strong style="display: block; font-size: 16px;">¡Entrega completada!</strong>
                                    <span style="font-size: 14px; opacity: 0.9;">Tu actividad ha sido enviada con éxito.</span>
                                </div>
                            </div>
                            
                            ${contenidoHTML}

                            <div class="seccion-estado-entrega">
                                <h3 style="font-size: 16px; font-weight: 600; color: #2D3748; margin-bottom: 15px;">Estado de Entrega</h3>
                                
                                <table style="width: 100%; border-collapse: collapse; font-size: 14px; background: #FFFFFF; border: 1px solid #E2E8F0;">
                                    <tr style="background: #F7FAFC; border-bottom: 1px solid #E2E8F0;">
                                        <td style="padding: 12px; font-weight: 600; width: 30%;">Estado</td>
                                        <td style="padding: 12px; color: #2B6CB0; font-weight: 600;">Entregada Correctamente</td>
                                    </tr>
                                    <tr style="border-bottom: 1px solid #E2E8F0;">
                                        <td style="padding: 12px; font-weight: 600;">Archivo enviado</td>
                                        <td style="padding: 12px;">
                                            <a href="/api/entregas/descargar/${datosEntrega._id}" style="color: #3182CE; text-decoration: underline; font-weight: 500;">
                                                📄 ${datosEntrega.nombreArchivo}
                                            </a>
                                        </td>
                                    </tr>
                                    <tr style="background: #F7FAFC; border-bottom: 1px solid #E2E8F0;">
                                        <td style="padding: 12px; font-weight: 600;">Calificación</td>
                                        <td style="padding: 12px; color: #4A5568;">${datosEntrega.calificacion || 'Sin calificar todavía'}</td>
                                    </tr>
                                    <tr style="border-bottom: 1px solid #E2E8F0;">
                                        <td style="padding: 12px; font-weight: 600;">Observaciones</td>
                                        <td style="padding: 12px; color: #4A5568;">${datosEntrega.observaciones || 'Ninguna'}</td>
                                    </tr>
                                    <tr style="background: #F7FAFC;">
                                        <td style="padding: 12px; font-weight: 600;">Retroalimentación</td>
                                        <td style="padding: 12px; color: #4A5568;">${datosEntrega.retroalimentacion || 'No hay comentarios adicionales'}</td>
                                    </tr>
                                </table>
                            </div>
                        `;

                        // 🌟 EFECTO MOMENTÁNEO:
                        // Desvanece la etiqueta a los 4 segundos y la elimina por completo a los 4.5 segundos
                        setTimeout(() => {
                            const alerta = document.getElementById('alerta-temporal');
                            if (alerta) {
                                alerta.style.opacity = '0'; // Aplica desvanecimiento suave
                                setTimeout(() => {
                                    alerta.remove(); // Remueve el espacio que ocupaba en el HTML
                                }, 500); 
                            }
                        }, 4000); // 4000 milisegundos = 4 segundos en pantalla

                    } else {
                        // Formulario de subida en caso de no haber entregas registradas
                        contenidoHTML += `
                            <div class="seccion-entrega" style="background: #F7FAFC; padding: 20px; border-radius: 6px; border: 1px dashed #CBD5E0;">
                                <h3 style="font-size: 16px; font-weight: 600; color: #2D3748; margin-bottom: 10px;">Tu Entrega</h3>
                                
                                <form id="form-entrega-tarea">
                                    <input type="hidden" id="actividadId" value="${actividad._id || actividad.id}">
                                    
                                    <label for="archivo-tarea" style="display: block; font-size: 14px; margin-bottom: 8px; color: #4A5568;">
                                        Selecciona tu archivo (PDF, Word, ZIP, etc. Máximo 8 MB):
                                    </label>
                                    <input type="file" id="archivo-tarea" required style="display: block; margin-bottom: 15px; font-size: 14px;">
                                    
                                    <button type="submit" style="background-color: #5cb85c; color: white; border: none; padding: 10px 20px; font-weight: 500; border-radius: 4px; cursor: pointer; transition: background 0.2s;">
                                        🚀 Enviar Tarea
                                    </button>
                                </form>
                                <div id="mensaje-entrega" style="margin-top: 10px; font-size: 14px; font-weight: 500;"></div>
                            </div>
                        `;

                        document.getElementById('contenido-dinamico').innerHTML = contenidoHTML;

                        const formEntrega = document.getElementById('form-entrega-tarea');
                        formEntrega.addEventListener('submit', async (e) => {
                            e.preventDefault();
                            
                            const fileInput = document.getElementById('archivo-tarea');
                            const idActividad = document.getElementById('actividadId').value;
                            const mensajeDiv = document.getElementById('mensaje-entrega');
                            const archivo = fileInput.files[0];

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
                                    setTimeout(() => {
                                        btn.click(); // Recarga la vista renderizando la tabla y activando el banner dinámico temporal
                                    }, 800);
                                } else {
                                    throw new Error(resData.message || "Error al subir la tarea");
                                }
                            } catch (error) {
                                console.error(error);
                                mensajeDiv.style.color = '#E53E3E';
                                mensajeDiv.textContent = `Error: ${error.message}`;
                            }
                        });
                    }
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