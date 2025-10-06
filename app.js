import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";


// Rutas
import getUsers from './src/controllers/getUsers.js';
import addUsers from './src/controllers/addUsers.js';
import editUser from './src/controllers/editUsers.js';
import getAllUser from './src/controllers/getAllUsers.js';
import addMovimientos from './src/controllers/addMovimientos.js';
import addFondos from "./src/controllers/addFondos.js";
import getFondos from "./src/controllers/getFondos.js";

// Configuración de variables de entorno
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());


const dta = { message: 'Servidor corriendo en el puerto' };


// api routes
const routes = [
    { path: "/api/getuser", router: getUsers },
    { path: "/api/getalluser", router: getAllUser },
    { path: "/api/adduser", router: addUsers },
    { path: "/api/edituser", router: editUser },
    { path: "/api/addfondos", router: addFondos },
    { path: "/api/getfondos", router: getFondos },
    { path: "/api/addmovimiento", router: addMovimientos },
];
// Usar las rutas
routes.forEach(route => app.use(route.path, route.router));

app.listen(PORT,()=>{
    console.log(`${dta.message}: ${PORT}`);
});