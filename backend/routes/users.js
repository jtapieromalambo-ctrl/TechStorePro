import express from "express";
import {registrarUser} from "../controllers/User.js";


const router=express.Router();

//ruta para registrar el usuario

router.post("/register",registrarUser);

export default router;