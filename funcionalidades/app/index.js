import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { method as autenticacion } from "./controllers/autenticacion.js";
import courseController from "./controllers/course.controller.js";

dotenv.config();

console.log("URI:", process.env.MONGO_URI);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB conectado"))
    .catch(err => console.log("❌ Error Mongo:", err));

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "pages", "login.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "pages", "register.html")));
app.get("/dashboard-estudiante", (req, res) => res.sendFile(path.join(__dirname, "pages", "dashboard-estudiante.html")));
app.get("/perfil", (req, res) => res.sendFile(path.join(__dirname, "pages", "perfil.html")));
app.get("/curso-detalle", (req, res) => res.sendFile(path.join(__dirname, "pages", "curso-detalle.html")));

app.post("/api/registro", autenticacion.register);
app.post("/api/login", autenticacion.login);
app.put("/api/usuarios/actualizar", autenticacion.actualizarPerfil); 

app.get("/api/cursos", courseController.obtenerCursos);
app.post("/api/cursos", courseController.crearCurso);
app.get("/api/mis-cursos", courseController.obtenerCursosEstudiante);
app.get("/api/cursos/:id", courseController.getCursoDetalle);

app.get("/api/cursos/docente/:idDocente", courseController.obtenerCursosPorDocente);
app.get("/api/cursos/estudiante/:idEstudiante", courseController.obtenerCursosEstudiante);

app.post("/api/entregas", courseController.guardarEntrega);

app.get("/api/entregas/descargar/:idEntrega", courseController.descargarArchivo);

app.get("/api/cursos/docente/:idDocente", courseController.obtenerCursosPorDocente);
app.get("/api/docente/actividades/:idActividad/entregas", courseController.obtenerEntregasPorActividad);
app.put("/api/entregas/calificar/:idEntrega", courseController.calificarEntrega);

app.get("/api/entregas/verificar/:actividadId/:estudianteId", courseController.verificarEntrega);

app.get("/test-inscripciones", async (req, res) => {
    const datos = await mongoose.connection.db.collection("inscripcions").find({}).toArray();
    res.json(datos);
});
 
app.get("/ver-colecciones", async (req, res) => {
    const db = mongoose.connection.db;
    const cursosMayus = await db.collection("Cursos").countDocuments();
    const cursosMinus = await db.collection("courses").countDocuments();
    res.json({ Cursos: cursosMayus, courses: cursosMinus });
});

app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "pages", "login.html")));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log("🚀 Servidor corriendo en puerto", PORT);
});
