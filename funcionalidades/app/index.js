import express from "express";
import path from 'path';
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));


//servidor 

const app = express();
app.set("port",4000);
app.listen(app.get("port"));
console.log("servidor corriendo en puerto",app.get("port"))

//configuracion
app.use(express.static(__dirname + "/public"));

//rutas 
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "login.html"));
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "register.html"));
});