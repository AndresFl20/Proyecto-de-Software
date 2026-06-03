import Curso from "../../models/curso.js";
import Inscripcion from "../../models/inscripcion.js";
import Actividad from "../../models/actividad.js";
import Entrega from "../../models/Entrega.js"; 
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

async function obtenerCursosEstudiante(req, res) {
    try {
        const inscripciones = await Inscripcion.find()
            .populate({
                path: "curso",
                populate: {
                    path: "docente",
                    select: "nombre"
                }
            });
        res.json(inscripciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error" });
    }
}

async function getCursoDetalle(req, res) {
    try {
        const idCurso = req.params.id;
        const curso = await Curso.findById(idCurso).populate("docente", "nombre");

        if (!curso) {
            return res.status(404).json({ message: "Curso no encontrado" });
        }

        const actividades = await Actividad.find({
            $or: [
                { cursoId: idCurso },
                { cursoId: new mongoose.Types.ObjectId(idCurso) }
            ]
        });

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
                actividadId: idActividad,
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
        const entregas = await Entrega.find({ actividadId: idActividad });
        return res.json({ solucionado: true, entregas });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al cargar las entregas" });
    }
}

async function calificarEntrega(req, res) {
    try {
        const { idEntrega } = req.params;
        const { calificacion, observaciones, retroalimentacion } = req.body;

        const entregaActualizada = await Entrega.findByIdAndUpdate(
            idEntrega,
            { calificacion, observaciones, retroalimentacion },
            { new: true }
        );

        return res.json({ message: "¡Calificación guardada con éxito! 📝", entrega: entregaActualizada });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al guardar la calificación" });
    }
}
async function obtenerCursosPorDocente(req, res) {
    try {
        const { idDocente } = req.params;

        // 🛡️ ESCUDO: Si el ID no viene, es la palabra "undefined" o no es un ObjectId válido de Mongo
        if (!idDocente || idDocente === "undefined" || !mongoose.Types.ObjectId.isValid(idDocente)) {
            console.log("⚠️ Se detuvo una petición con un ID de docente inválido:", idDocente);
            return res.status(400).json({ 
                solucionado: false, 
                message: "ID de docente inválido o no proporcionado en la sesión." 
            });
        }

        const cursos = await Curso.find({ docente: idDocente });
        return res.json({ solucionado: true, cursos });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al cargar las asignaturas del docente" });
    }
}

export const method = {
    obtenerCursos,
    crearCurso,
    obtenerCursosEstudiante,
    getCursoDetalle,
    guardarEntrega,
    obtenerEntregasPorActividad,
    calificarEntrega, // <--- ESTO ES LO QUE FALTABA
    obtenerCursosPorDocente
};