// importar el modelo de la base de datos

import user from "../models/user.js";

//obtener perfil de la base de datos

export const obtenerPerfil = async (req,res)=>{
    try {
        const{email} =req.body
        if(!email){
            return res.status(400).json({message:"Email es requerido"})

        }

        //traer el correo del usuario
        const usuario = await user.findOne({correo:email}).select('-password')
        if(!usuario){
            return res.status(400).json({message:"Usuario no encontrado"})

        }
        res.status(200).json({
            usuario:{
                id: usuario._id,
                nombre: usuario.nombre,
                apellidos: usuario.apellidos,
                telefono: usuario.telefono,
                correo: usuario.correo,
            }
        })
    } catch (error) {
        res.status(500).json({
            message:"Error al obtener ",
            error: error.message
        })
        
    }
}
// Actualizar perfil del usuario
export const actualizarPerfil = async (req, res)=>{
    try {
        const{ email, nombre, apellidos, telefono }= req.body
// validar campos obligatorios

        if (!email){
            return res.status(400).json({message: "Email es requerido"})
        }

        if (!nombre || !apellidos|| !telefono ){
            return res.status(400).json({message: "Todos los campos son obligatorios"})

        }

        const usuarioActualizacion = await user.findOneAndUpdate(
            {correo:email},
            {
                nombre: nombre,
                apellidos: apellidos,
                telefono: telefono
            },
            {new: true}
            //no va a seleccionar el campo password
        ).select('-password')
        if (!usuarioActualizacion){
            return res.status(404).json({message: "Usuario no encontrado"})
        }
        res.status(200).json({
            message: "Perfil actualizando exitosamente",
            usuario: {
                id: usuarioActualizacion._id,
                nombre: usuarioActualizacion.nombre,
                apellidos: usuarioActualizacion.apellidos,
                email: usuarioActualizacion.correo,
                telefono: usuarioActualizacion.telefono
            }
        })


    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar perfil",
            error:error.message
        })
    }
}

// Eliminar Perfil
export const eliminarPerfil = async (req, res)=>{
    try {
        const {email} = req.body

        //validar que el imail este presente
        if (!email){
            return res.status(400).json({message: "Email es requerido"})
        }
        //Buscar y eliminar usuario
        const usuarioEliminado = await user.findOneAndDelete({
            correo:email
        })
        if(!usuarioEliminado){
            return res.status(404).json({message: "Usuario no encontrado"})
        }
        res.status(200).json({
            message: "usuario eliminado exitosamente",
            usuario:{
                id: usuarioEliminado._id,
                nombre: usuarioEliminado.nombre,
                apellidos: usuarioEliminado.apellidos,
                email: usuarioEliminado.correo
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar perfil",
            error:error.message
        })
    }
}

// Buscar usuario
       // Buscar usuario
export const validarCodigo = async (req, res) => {
    try {
        const { correo, codigo } = req.body;

        const usuario = await user.findOne({ 
            correo,
            codigoRecuperacion: codigo,
            codigoExpiracion: { $gt: Date.now() }
        });

        if (!usuario) {
            return res.status(400).json({ 
                message: "Código inválido o expirado" 
            });
        }

        res.status(200).json({ message: "Código válido" });

    } catch (error) {
        res.status(500).json({ 
            message: "Error al validar el código",
            error: error.message
        });
    }
};