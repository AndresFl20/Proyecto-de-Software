import User from "../../models/usuarioj.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'clave_secreta_super_segura';

// REGISTRO DE USUARIOS
export async function register(req, res) {
    console.log("Datos recibidos:", req.body);
    const { nombre, password, email, rol } = req.body;

    if (!nombre || !password || !email || !rol) {
        return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
    }

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).send({ status: "Error", message: "El usuario ya existe con ese correo" });
        }

        const nuevoUsuario = new User({
            nombre,
            email,
            password,
            rol
        });

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

// INICIO DE SESIÓN
export async function login(req, res) {
    console.log("Datos de login recibidos:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
    }

    try {
        const userFound = await User.findOne({ email });

        if (!userFound) {
            return res.status(401).send({ status: "Error", message: "Credenciales incorrectas" });
        }

        if (userFound.password !== password) {
            return res.status(401).send({ status: "Error", message: "Credenciales incorrectas" });
        }

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
                rol: userFound.rol,
                imagen: userFound.imagen || '/img/default.jpg' // <-- AHORA ENVÍA LA FOTO AL INICIAR SESIÓN
            }
        });

    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).send({ status: "Error", message: "Error interno del servidor" });
    }
}

// ACTUALIZAR PERFIL DE USUARIO
async function actualizarPerfil(req, res) {
    try {
        const { nombre, email, password, imagen } = req.body;

        const camposAActualizar = {
            nombre: nombre
        };

        if (password) {
            camposAActualizar.password = password;
        }

        if (imagen) {
            camposAActualizar.imagen = imagen;
        }

        const usuarioActualizado = await User.findOneAndUpdate(
            { email: email },
            { $set: camposAActualizar },
            { new: true }
        );

        if (!usuarioActualizado) {
            return res.status(404).json({ mensaje: "Usuario no encontrado en la base de datos." });
        }

        return res.json({
            mensaje: "¡Perfil actualizado con éxito!",
            usuario: usuarioActualizado
        });

    } catch (error) {
        console.error("Error al actualizar perfil:", error);
        return res.status(500).json({ mensaje: "Hubo un error interno en el servidor." });
    }
}

export const method = {
    register,
    login,
    actualizarPerfil
};