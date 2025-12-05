import bcrypt from "bcrypt";
import users from "../models/user.js";

export const LoginUser = async (req, res) => {
    try {
        const { correo, password } = req.body;

        //validar los campos esten presentes
        if (!correo || !password) {
            return res.status(400).json({ message: "Correo y Contraseña Obligatorio" });
        }

        //Buscar el usuario en la base de datos
        const usuario = await users.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        //comparar la contraseña encryptada
        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }
//validamos el inicio de sesion
        
        res.status(200).json({
            message: "Inicio de sesión correcto",
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                apellidos: usuario.apellidos,
                telefono: usuario.telefono,
                correo: usuario.correo,
                password: usuario.password   
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al iniciar sesión",
            error: error.message
        });
    }
};
