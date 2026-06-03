import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { type: String, default: 'estudiante' },
    imagen: { type: String, default: '/img/default.jpg' }, // <--- ESTA ES LA NUEVA LÍNEA 
    createdAt: { type: String, default: () => new Date().toLocaleDateString() }
}, { collection: 'user' });

const User = mongoose.model('User', userSchema);

export default User;