import mongoose from "mongoose";

const cursoSchema = new mongoose.Schema({

    nombre: {
        type: String,
        required: true
    },

    descripcion: {
        type: String,
        required: true
    },

    imagen: {
        type: String,
        default: ""
    },

    docente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
    },

    estado: {
        type: String,
        default: "activo"
    }

}, {
    collection: "courses"
});

export default mongoose.model("Curso", cursoSchema);