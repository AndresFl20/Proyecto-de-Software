import Curso from "../../models/curso.js";
import Inscripcion from "../../models/inscripcion.js";
import Actividad from "../../models/actividad.js";
import Entrega from "../../models/entrega.js";
import User from "../../models/usuarioj.js"; 
import mongoose from "mongoose";
import multer from "multer"; 

const storage = multer.memoryStorage();
export const upload = multer({
    storage: storage,
    limits: { fileSize: 8 * 1024 * 1024 } 
});

async function obtenerCursos(req, res) {
    try {
        const cursos = await Curso.find();
        res.json(cursos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener cursos" });
    }
}

async function crearCurso(req, res) {
    try {
        const curso = new Curso(req.body);
        await curso.save();
        res.status(201).json(curso);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear curso" });
    }
}

// 👨‍🎓 CORREGIDO Y BLINDADO: Versión final única que castea a ObjectId dinámicamente
async function obtenerCursosEstudiante(req, res) {
    try {
        const { idEstudiante } = req.params;

        console.log("===> BACKEND: Buscando cursos para el estudiante ID:", idEstudiante);

        if (!idEstudiante || idEstudiante === "undefined") {
            return res.status(400).json({ message: "ID de estudiante no proporcionado" });
        }

        // 1. Buscamos las inscripciones (coincidiendo texto plano u objeto)
        const queryInscripcion = {
            $or: [
                { estudiante: idEstudiante.toString() },
                { estudiante: mongoose.Types.ObjectId.isValid(idEstudiante) ? new mongoose.Types.ObjectId(idEstudiante) : null }
            ]
        };

        const inscripciones = await Inscripcion.find(queryInscripcion).lean();

        console.log(`===> BACKEND: Se encontraron ${inscripciones.length} inscripciones de este alumno en la BD.`);

        if (!inscripciones || inscripciones.length === 0) {
            return res.json([]); 
        }

        // 2. Extraemos los IDs de los cursos como Strings limpios
        const idsCursosTexto = inscripciones
            .map(ins => ins.curso ? ins.curso.toString().trim() : null)
            .filter(Boolean);

        // 3. Convertimos obligatoriamente cada texto a un ObjectId real de Mongo
        const idsCursosObjectId = idsCursosTexto
            .filter(id => mongoose.Types.ObjectId.isValid(id))
            .map(id => new mongoose.Types.ObjectId(id));

        // 4. Buscamos en la colección de cursos admitiendo ambos formatos en el identificador principal
        const cursos = await Curso.find({
            $or: [
                { _id: { $in: idsCursosTexto } },
                { _id: { $in: idsCursosObjectId } }
            ]
        }).populate("docente", "nombre").lean();

        res.json(cursos);
    } catch (error) {
        console.error("Error en obtenerCursosEstudiante:", error);
        res.status(500).json({ message: "Error al cargar las asignaturas del estudiante" });
    }
}

async function getCursoDetalle(req, res) {
    try {
        const idCurso = req.params.id;
        const { usuarioId } = req.query; 

        const curso = await Curso.findById(idCurso).populate("docente", "nombre");

        if (!curso) {
            return res.status(404).json({ message: "Curso no encontrado" });
        }

        const actividadesRaw = await Actividad.find({
            $or: [
                { cursoId: idCurso },
                { cursoId: new mongoose.Types.ObjectId(idCurso) }
            ]
        }).lean();

        let actividades = [];
        if (usuarioId && mongoose.Types.ObjectId.isValid(usuarioId)) {
            actividades = await Promise.all(actividadesRaw.map(async (actividad) => {
                // 🌟 ASEGURAMOS TRAER: calificacion, retroalimentacion y nombreArchivo
                const entrega = await Entrega.findOne({
                    actividadId: actividad._id,
                    estudianteId: usuarioId
                }).select("calificacion retroalimentacion fechaEntrega nombreArchivo").lean();

                return {
                    ...actividad,
                    entrega: entrega || null // Si hay entrega, se adjunta aquí completo
                };
            }));
        } else {
            actividades = actividadesRaw;
        }

        res.json({
            curso,
            actividades
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al obtener el detalle del curso y sus actividades"
        });
    }
}

async function guardarEntrega(req, res) {
    upload.single('archivo')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'El archivo es demasiado pesado. El límite máximo es de 8 MB.' });
            }
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(500).json({ message: 'Error al procesar el archivo.' });
        }

        try {
            const { idActividad, idCurso, idEstudiante } = req.body;

            if (!req.file) {
                return res.status(400).json({ message: 'No se seleccionó ningún archivo.' });
            }

            if (!idEstudiante || idEstudiante === "null" || idEstudiante === "undefined") {
                return res.status(401).json({ message: 'No autorizado. No se detectó la identidad del estudiante.' });
            }

            const nuevaEntrega = new Entrega({
                estudianteId: idEstudiante, 
                cursoId: idCurso,
                actividadId: idActividad, // 🌟 CORREGIDO: Tenías activityId, cambiado a actividadId para que coincida con tu modelo
                nombreArchivo: req.file.originalname,
                mimetype: req.file.mimetype,
                datosArchivo: req.file.buffer 
            });

            await nuevaEntrega.save();
            return res.status(200).json({ message: '¡Tarea entregada con éxito! 🎉' });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error interno al guardar la entrega.' });
        }
    });
}

async function obtenerEntregasPorActividad(req, res) {
    try {
        const { idActividad } = req.params;
        
        const entregas = await Entrega.find({ actividadId: idActividad })
            .populate({
                path: "estudianteId",
                model: "User", // El modelo de tu archivo usuarioj.js
                select: "nombre email"
            }) 
            .select("-datosArchivo") 
            .lean();
            
        return res.json({ solucionado: true, entregas });
    } catch (error) {
        console.error("❌ Error al cargar entregas:", error);
        return res.status(500).json({ message: "Error al cargar las entregas" });
    }
}

async function calificarEntrega(req, res) {
    try {
        const { idEntrega } = req.params; // Puede venir el _id de la entrega, o el idActividad
        const { calificacion, retroalimentacion, estudianteId } = req.body; // Recibimos también el estudianteId por si acaso

        console.log(`==> Intentando calificar/actualizar entrega. ID recibido: ${idEntrega}`);

        if (!idEntrega) {
            return res.status(400).json({ solucionado: false, message: "Falta el identificador para calificar." });
        }

        // 🚀 BÚSQUEDA INTELIGENTE: Intentamos actualizar por _id, o en su defecto por actividadId + estudianteId
        let entregaActualizada = await Entrega.findOneAndUpdate(
            {
                $or: [
                    { _id: mongoose.Types.ObjectId.isValid(idEntrega) ? idEntrega : null },
                    { actividadId: idEntrega, estudianteId: estudianteId }
                ]
            },
            { 
                calificacion: Number(calificacion),
                retroalimentacion: retroalimentacion 
            },
            { new: true } // Devuelve el documento ya modificado
        );

        // Si no se encontró de la forma anterior, intentamos una búsqueda flexible por si los IDs vienen invertidos
        if (!entregaActualizada && estudianteId) {
            entregaActualizada = await Entrega.findOneAndUpdate(
                { actividadId: idEntrega, estudianteId: estudianteId },
                { calificacion: Number(calificacion), retroalimentacion: retroalimentacion },
                { new: true }
            );
        }

        if (!entregaActualizada) {
            console.log("❌ No se encontró la entrega en la base de datos para actualizar.");
            return res.status(404).json({ 
                solucionado: false, 
                message: "No se encontró una entrega previa para modificar." 
            });
        }

        console.log("✅ ¡Calificación/Modificación guardada con éxito en MongoDB!");
        return res.status(200).set('Content-Type', 'application/json').json({ 
            solucionado: true, 
            message: "¡Calificación actualizada con éxito!" 
        });

    } catch (error) {
        console.error("❌ Error crítico en calificarEntrega Backend:", error);
        return res.status(500).json({ 
            solucionado: false, 
            message: "Error interno del servidor al procesar la nota." 
        });
    }
}

async function obtenerCursosPorDocente(req, res) {
    try {
        const { idDocente } = req.params;

        if (!idDocente || idDocente === "undefined") {
            return res.status(400).json({ 
                solucionado: false, 
                message: "ID de docente inválido o no proporcionado." 
            });
        }

        const queryBusqueda = {
            $or: [
                { docente: idDocente.toString() },
                { docente: mongoose.Types.ObjectId.isValid(idDocente) ? new mongoose.Types.ObjectId(idDocente) : null }
            ]
        };

        const cursos = await Curso.find(queryBusqueda);
        return res.json({ solucionado: true, cursos });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al cargar las asignaturas del docente" });
    }
}

async function descargarArchivo(req, res) {
    try {
        const { idEntrega } = req.params;

        // Buscamos la entrega por su ID en la base de datos
        const entrega = await Entrega.findById(idEntrega);

        if (!entrega) {
            return res.status(404).send("La entrega especificada no existe.");
        }

        if (entrega.datosArchivo) {
            res.setHeader('Content-Type', entrega.tipoMime || 'application/pdf');
            

            res.setHeader('Content-Disposition', `inline; filename="${entrega.nombreArchivo || 'archivo'}"`);

            return res.send(entrega.datosArchivo);
        } 

        
        else {
            return res.status(404).send("Esta entrega no contiene los datos del archivo.");
        }

    } catch (error) {
        console.error("Error al descargar archivo:", error);
        return res.status(500).send("Error interno al procesar el archivo.");
    }
}

async function verificarEntrega(req, res) {
    try {
        const { actividadId, estudianteId } = req.params;

        if (!actividadId || !estudianteId) {
            return res.status(400).json({ entregado: false, message: "Faltan parámetros requeridos." });
        }

        // Buscamos en tu modelo 'Entrega' si coincide la actividad y el estudiante
        const entrega = await Entrega.findOne({
            actividadId: actividadId,
            estudianteId: estudianteId
        }).lean();

        if (entrega) {
            // Si existe la entrega, respondemos de forma exitosa mandando los datos
            return res.status(200).json({
                entregado: true,
                entrega: entrega
            });
        } else {
            // Si no existe, respondemos también exitosamente avisando que no hay entrega aún
            return res.status(200).json({
                entregado: false
            });
        }

    } catch (error) {
        console.error("❌ Error en verificarEntrega del Backend:", error);
        return res.status(500).json({ message: "Error interno del servidor al verificar la entrega" });
    }
}

export default {
    obtenerCursos,
    crearCurso,
    obtenerCursosEstudiante,
    getCursoDetalle,
    guardarEntrega,
    obtenerEntregasPorActividad,
    calificarEntrega, 
    obtenerCursosPorDocente,
    descargarArchivo,
    verificarEntrega
};