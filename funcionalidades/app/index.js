import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { method as autenticacion } from "./controllers/autenticacion.js";
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// 🔥 MIDDLEWARES
app.use(express.json()); // para recibir JSON
app.use(express.static(path.join(__dirname, "public")));

// 🔥 CONEXIÓN A MONGO
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB conectado"))
    .catch(err => console.log("❌ Error Mongo:", err));

// 🔥 PUERTO
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto", PORT);
});

// 🔥 RUTAS HTML
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "login.html"));
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "register.html"));
});

app.post("/api/registro", autenticacion.register);
app.post("/api/login", autenticacion.login);