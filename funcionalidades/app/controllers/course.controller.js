import Curso from "../../models/curso.js";
import Inscripcion from "../../models/inscripcion.js";

async function obtenerCursos(req, res) {
    try {

        console.log("MODELO:", Curso.modelName);
        console.log("COLECCION:", Curso.collection.name);

        const cursos = await Curso.find();

        console.log("RESULTADO:", cursos);

        res.json(cursos);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error al obtener cursos"
        });
    }
}

async function crearCurso(req, res) {
    try {

        const curso = new Curso(req.body);

        await curso.save();

        res.status(201).json(curso);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error al crear curso"
        });
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

        res.status(500).json({
            message: "Error"
        });
    }
}

export const method = {
    obtenerCursos,
    crearCurso,
    obtenerCursosEstudiante
};