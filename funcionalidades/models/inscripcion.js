import mongoose from "mongoose";

const inscripcionSchema = new mongoose.Schema({

    estudiante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    curso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Curso",
        required: true
    },

    progreso: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true
});

export default mongoose.model(
    "Inscripcion",
    inscripcionSchema
);