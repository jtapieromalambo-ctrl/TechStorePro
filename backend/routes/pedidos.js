import express from "express"
import { crearPedido } from "../controllers/pedidos.js"



const router= express.Router()

router.post('/crearPedido',crearPedido)



export default router