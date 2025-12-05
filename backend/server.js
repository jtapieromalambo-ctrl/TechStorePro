import express from 'express';
import cors from 'cors';
import "./db/db.js";
import ProductosRoutes from "./routes/Productos.js"
import userrouter from "./routes/users.js"
import loginrouter from "./routes/login.js";
import obtenerPerfil from './routes/perfil.js'
import RecuperarPassword from './routes/recuperacion.js'
import pedidosRouter  from './routes/pedidos.js';



const app =express();
app.use(express.json());
// Habilitar todas las rutas

app.use(cors());

//Primera ruta

app.get('/',(req,res)=>{
    res.send('Bievenidos al curso de node express');
});

app.use("/api/productos",ProductosRoutes);
app.use("/api/User",userrouter);
app.use("/api/login",loginrouter);
app.use("/api/perfil", obtenerPerfil)
app.use('/api/Recuperar',RecuperarPassword)
app.use('/api/pedidos',pedidosRouter)

app.listen(8081,()=>console.log('servidor corriendo en http://localhost:8081'));