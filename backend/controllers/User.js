import users from "../models/user.js";
import bcrypt from "bcrypt";


//creacion de los ususarios 

export const registrarUser =async (req,res)=>{
       try {
        const{nombre,apellidos,telefono,correo,password}=req.body;

        //validar que no falte ningun campo
    if(!nombre || !apellidos || !telefono || !correo || !password){
        return res.status(400).json({message:"Todos los campos son obligatorios"});
    }
    //validad si el usuario existe
    const existeUsuario=await users.findOne({correo});
    if(existeUsuario){
        return res.status(400).json({message:"Usuario ya esta registrado"});
    }

    //Encriptar la contraseña

    const saltRounds=10;
    const hasshedPassword=await bcrypt.hash(password,saltRounds);

    //crear el usuario en la base de datos
    const nuevoUsuario= new users({nombre,apellidos,telefono,correo,password:hasshedPassword});
    await nuevoUsuario.save();
    res.status(201).json({message:"Usuario Registrado con exito"});

    } catch (error) {
        res.status(500).json({message:"Error al registrar al usuario",error:error.message});
    }
}