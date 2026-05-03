import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    // Cambiamos "user" por "nombre" para que coincida con tu base de datos
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { type: String, default: 'estudiante' },
    createdAt: { type: String, default: () => new Date().toLocaleDateString() }
}, { collection: 'user' }); // Mantiene tu colección 'user'

const User = mongoose.model('User', userSchema);

export default User;