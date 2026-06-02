import mongoose from "mongoose";

const entregaSchema = new mongoose.Schema({
    estudianteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    cursoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Curso', required: true },
    actividadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Actividad', required: true },
    nombreArchivo: { type: String, required: true },
    mimetype: { type: String, required: true },
    datosArchivo: { type: Buffer, required: true }, 
    fechaEntrega: { type: Date, default: Date.now }
});

export default mongoose.model('Entrega', entregaSchema);