import User from '../../models/usuarioj.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'clave_secreta_super_segura';

// 1. Controlador de Registro
export async function register(req, res) {
    console.log("Datos recibidos:", req.body);
    const { nombre, password, email, rol } = req.body;

    // Validamos que los 4 campos principales existan
    if (!nombre || !password || !email || !rol) {
        return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
    }

    try {
        // Verificar si el usuario ya existe con ese correo
        const userExists = await User.findOne({ email });
        
        if (userExists) {
            return res.status(400).send({ status: "Error", message: "El usuario ya existe con ese correo" });
        }

        // Crear el nuevo documento con los datos exactos del esquema
        const nuevoUsuario = new User({
            nombre,
            email,
            password,
            rol
        });

        // Guardar en la base de datos
        await nuevoUsuario.save();

        res.status(201).send({ 
            status: "Success", 
            message: "Usuario registrado exitosamente", 
            user: nuevoUsuario 
        });

    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).send({ status: "Error", message: "Error al guardar el usuario en la base de datos" });
    }
}

// 2. Controlador de Login
export async function login(req, res) {
    console.log("Datos de login recibidos:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
    }

    try {
        // Buscar al usuario por correo
        const userFound = await User.findOne({ email });

        if (!userFound) {
            return res.status(401).send({ status: "Error", message: "Credenciales incorrectas" });
        }

        // Verificar la contraseña 
        if (userFound.password !== password) {
            return res.status(401).send({ status: "Error", message: "Credenciales incorrectas" });
        }

        // Generamos el Token JWT
        const token = jwt.sign(
            { 
                id: userFound._id, 
                email: userFound.email, 
                rol: userFound.rol 
            }, 
            SECRET_KEY, 
            { expiresIn: '2h' }
        );

        res.status(200).send({ 
            status: "Success", 
            message: "Inicio de sesión exitoso", 
            token: token,
            user: { 
                nombre: userFound.nombre,
                email: userFound.email, 
                rol: userFound.rol 
            } 
        });

    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).send({ status: "Error", message: "Error interno del servidor" });
    }
}

// 🔥 Exportamos el objeto method tal como lo espera tu index.js
export const method = {
    register,
    login
};
