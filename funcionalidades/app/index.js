import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";

// 🔥 1. Forzar servidores DNS para solucionar el error de resolución
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 🔥 2. Cargar .env apuntando explícitamente a la raíz del proyecto
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();

// 🔥 MIDDLEWARES
app.use(express.json());
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

