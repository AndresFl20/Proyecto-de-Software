import User from '../../models/usuarioj.js';

async function login(req, res) {
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

        res.status(200).send({ 
            status: "Success", 
            message: "Inicio de sesión exitoso", 
            user: { user: userFound.user, email: userFound.email, rol: userFound.rol } 
        });

    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).send({ status: "Error", message: "Error interno del servidor" });
    }
}

async function register(req, res) {
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
            // 'createdAt' no es necesario agregarlo aquí porque el esquema lo crea automáticamente.
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

export default register; // O module.exports si usas CommonJS

export const method = {
    login,
    register
};
