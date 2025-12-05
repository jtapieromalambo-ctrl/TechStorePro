import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({

    nombre:{type:String,required:true},
    apellidos:{type:String,required:true},
    telefono:{type:Number,required:true, maxlength:10},
    correo:{type:String,required:true},
    password:{type:String,required:true,minlength:8},

    codigoRecuperacion: {
        type: String,
        default: null
    },
    codigoExpiracion:{
        type:Number,
        default:null
    }

});



const User=mongoose.model("User",UserSchema,"User");
export default User;