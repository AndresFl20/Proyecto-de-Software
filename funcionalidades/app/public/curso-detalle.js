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

        // 1. Obtener los datos del usuario conectado (ID y ROL)
        const usuarioLocalStorage = localStorage.getItem('usuario');
        let estudianteId = "69f64e57401aacdb5189c2e1"; 
        let rolUsuario = "estudiante"; // Por defecto asumimos estudiante

        if (usuarioLocalStorage) {
            try {
                const usuarioObjeto = JSON.parse(usuarioLocalStorage);
                estudianteId = usuarioObjeto._id || usuarioObjeto.id || estudianteId;
                rolUsuario = usuarioObjeto.rol || usuarioObjeto.role || rolUsuario;
            } catch (e) {
                console.error("Error parseando usuario:", e);
            }
        }

        // Normalizamos el rol a minúsculas
        rolUsuario = rolUsuario.toLowerCase();
        const esProfesor = rolUsuario.includes("docente") || rolUsuario.includes("profesor");

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
            <p><em>Selecciona cualquiera de las actividades de la barra lateral izquierda para ver sus detalles.</em></p>
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

                    // Estructura común superior (Instrucciones)
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

                    // ==========================================================
                    // 👨‍🏫 MODO PROFESOR: LISTAR TRABAJOS RECIBIDOS
                    // ==========================================================
                    if (esProfesor) {
                        contenidoHTML += `
                            <h3 style="font-size: 18px; font-weight: 600; color: #2D3748; margin-bottom: 15px;"> Trabajos Recibidos de los Estudiantes</h3>
                            <div id="contenedor-tabla-calificaciones" style="overflow-x: auto;">
                                <p style="color: #718096;">Cargando entregas...</p>
                            </div>
                        `;

                        document.getElementById('contenido-dinamico').innerHTML = contenidoHTML;

                        // Llamamos a la función encargada de dibujar la tabla del profesor
                        cargarEntregasParaProfesor(actividad._id || actividad.id);

                    // ==========================================================
                    // 👨‍🎓 MODO ESTUDIANTE: MOSTRAR SU PROPIA ENTREGA / CALIFICACIÓN
                    // ==========================================================
                    } else {
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

                        if (entregaRealizada) {
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
                                            <td style="padding: 12px; color: #E53E3E; font-weight: 700; font-size: 15px;">
                                                ${datosEntrega.calificacion !== null && datosEntrega.calificacion !== undefined ? `${datosEntrega.calificacion} / 5` : '⚠️ Sin calificar todavía'}
                                            </td>
                                        </tr>
                                        <tr style="border-bottom: 1px solid #E2E8F0;">
                                            <td style="padding: 12px; font-weight: 600;">Retroalimentación del Docente</td>
                                            <td style="padding: 12px; color: #2D3748; font-style: italic; background: #FFFDF5;">
                                                ${datosEntrega.retroalimentacion || 'El docente no ha dejado comentarios adicionales.'}
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            `;

                            setTimeout(() => {
                                const alerta = document.getElementById('alerta-temporal');
                                if (alerta) {
                                    alerta.style.opacity = '0';
                                    setTimeout(() => alerta.remove(), 500); 
                                }
                            }, 4000);

                        } else {
                            // Formulario de envío para el alumno
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
                                        setTimeout(() => { btn.click(); }, 800);
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

async function cargarEntregasParaProfesor(idActividad) {
    const contenedor = document.getElementById('contenedor-tabla-calificaciones');
    try {
        const res = await fetch(`/api/docente/actividades/${idActividad}/entregas`);
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || `Error del servidor (Código ${res.status})`);
        }

        if (!data.entregas || data.entregas.length === 0) {
            contenedor.innerHTML = `<p style="color: #A0AEC0; font-style: italic; background: #F7FAFC; padding: 15px; border-radius: 4px; border: 1px dashed #E2E8F0; margin-top: 15px;">Ningún estudiante ha enviado tareas para esta actividad aún.</p>`;
            return;
        }

        let tablaHTML = `
            <table style="width: 100%; border-collapse: collapse; background: white; font-size: 14px; border: 1px solid #E2E8F0; margin-top: 15px;">
                <thead>
                    <tr style="background: #EDF2F7; border-bottom: 2px solid #CBD5E0; text-align: left;">
                        <th style="padding: 12px; font-weight: 600; color: #4A5568;">Estudiante</th>
                        <th style="padding: 12px; font-weight: 600; color: #4A5568;">Archivo Enviado</th>
                        <th style="padding: 12px; font-weight: 600; color: #4A5568;">Nota (1.0 - 5.0)</th>
                        <th style="padding: 12px; font-weight: 600; color: #4A5568;">Retroalimentación</th>
                        <th style="padding: 12px; font-weight: 600; color: #4A5568;">Acción</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.entregas.forEach(entrega => {
            const nombreEstudiante = entrega.estudianteId?.nombre || "Estudiante Desconocido";
            const notaActual = entrega.calificacion !== null && entrega.calificacion !== undefined ? entrega.calificacion : "";
            const feedbackActual = entrega.retroalimentacion || "";

            tablaHTML += `
                <tr style="border-bottom: 1px solid #E2E8F0;" id="fila-${entrega._id}">
                    <td style="padding: 12px; font-weight: 500; color: #2D3748;">${nombreEstudiante}</td>
                    <td style="padding: 12px;">
                        <a href="/api/entregas/descargar/${entrega._id}" style="color: #3182CE; text-decoration: underline; font-weight: 500;" target="_blank">
                            📄 ${entrega.nombreArchivo || "Descargar Tarea"}
                        </a>
                    </td>
                    <td style="padding: 12px;">
                        <input type="number" step="0.1" min="1" max="5" id="nota-${entrega._id}" value="${notaActual}" placeholder="Ej: 4.5" style="width: 70px; padding: 6px; border: 1px solid #CBD5E0; border-radius: 4px; text-align: center;">
                    </td>
                    <td style="padding: 12px;">
                        <input type="text" id="feedback-${entrega._id}" value="${feedbackActual}" placeholder="Buen trabajo..." style="width: 100%; min-width: 180px; padding: 6px; border: 1px solid #CBD5E0; border-radius: 4px;">
                    </td>
                    <td style="padding: 12px;">
                        <button onclick="guardarNotaProfesor('${entrega._id}')" style="background-color: #3182CE; color: white; border: none; padding: 6px 12px; font-weight: 500; border-radius: 4px; cursor: pointer; transition: background 0.2s;">
                            💾 Guardar
                        </button>
                    </td>
                </tr>
            `;
        });

        tablaHTML += `</tbody></table>`;
        contenedor.innerHTML = tablaHTML;

    } catch (err) {
        console.error("Error capturado en el Frontend:", err);
        contenedor.innerHTML = `<p style="color: #E53E3E; font-weight: 500; margin-top: 15px;">⚠️ Error al cargar los trabajos recibidos: ${err.message}</p>`;
    }
}

window.guardarNotaProfesor = async function(idEntrega) {
    const inputNota = document.getElementById(`nota-${idEntrega}`);
    const inputFeedback = document.getElementById(`feedback-${idEntrega}`);

    // Capturamos el estudianteId si lo tienes guardado en algún atributo de la fila (ej: data-estudiante)
    // O si tu tabla tiene acceso al ID del estudiante que se está calificando.
    const fila = document.getElementById(`fila-${idEntrega}`);
    const estudianteId = fila ? fila.getAttribute('data-estudiante-id') : null; 

    const calificacion = parseFloat(inputNota.value);
    const retroalimentacion = inputFeedback.value;

    if (isNaN(calificacion) || calificacion < 1 || calificacion > 5) {
        alert("Por favor, ingresa una nota válida entre 1.0 y 5.0");
        return;
    }

    try {
        // Hacemos la petición PUT a tu ruta de calificar
        const response = await fetch(`/api/entregas/calificar/${idEntrega}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                calificacion, 
                retroalimentacion,
                estudianteId: estudianteId // 🚀 Enviamos esto para respaldar la búsqueda si idEntrega no es el _id
            })
        });

        // 🛡️ BLINDAJE: Verificamos si la respuesta es realmente un JSON antes de parsearlo
        const contentType = response.headers.get("content-type");
        let data;
        
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            // Si el servidor responde con HTML o texto, capturamos el error sin romper el código
            const textoError = await response.text();
            console.error("El servidor no devolvió JSON. Devolvió esto:", textoError);
            throw new Error("El servidor respondió con un formato incorrecto (HTML/Texto).");
        }

        if (response.ok && data.solucionado) {
            if (fila) {
                fila.style.backgroundColor = "#E6FFFA"; 
                setTimeout(() => { fila.style.backgroundColor = "transparent"; }, 1500);
            }
            alert("¡Calificación actualizada con éxito! 📝🎉");
        } else {
            alert("Error al guardar la calificación: " + (data.message || "Error desconocido"));
        }
    } catch (err) {
        console.error("❌ Error real en el frontend mapeado:", err);
        alert("Ocurrió un problema al procesar o guardar la nota. Revisa la consola.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const campana = document.getElementById("campana");
    const panelNotificaciones = document.getElementById("panelNotificaciones");
    const listaNotificaciones = document.getElementById("listaNotificaciones");

    // 1. Alternar (abrir/cerrar) el panel al dar clic en la campana
    if (campana && panelNotificaciones) {
        campana.addEventListener("click", (e) => {
            e.stopPropagation(); // Evita que se cierre inmediatamente al propagar el clic
            panelNotificaciones.classList.toggle("mostrar");
        });

        // Cerrar el panel automáticamente si el usuario hace clic en cualquier otra parte de la pantalla
        document.addEventListener("click", () => {
            panelNotificaciones.classList.remove("mostrar");
        });
    }

    // 2. Inyectar las notificaciones quemadas del compañero
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