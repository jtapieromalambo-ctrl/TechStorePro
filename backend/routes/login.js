import express from "express";
import { LoginUser } from "../controllers/login.js";

const router=express.Router();

//la ruta

router.post("/",LoginUser);

export default router;