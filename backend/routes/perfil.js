import express from "express"
import { obtenerPerfil, actualizarPerfil, eliminarPerfil } from "../controllers/perfil.js"

const router= express.Router()

router.put('/actualizar', actualizarPerfil)
router.post('/obtener',obtenerPerfil)
router.delete('/eliminar',eliminarPerfil)

export default router