import mongoose from 'mongoose';

const actividadSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String },
    instrucciones: { type: String }, 
    cursoId: {                    
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Curso', 
        required: true 
    },
    docenteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    fechaEntrega: { type: String }
}, { 
    timestamps: true,
    collection: 'activities'
});

const Actividad = mongoose.model('Actividad', actividadSchema);
export default Actividad;