import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    productid:{type:String,required:true,unique:true},
    nombre:{type:String,required:true},
    descripcion:{type:String,required:true},
    precio:{type:Number,required:true},
    imagen:{type:String,required:true}

});

//forzamos que me guarde la informacion en la coleccion del sistema

const Product=mongoose.model("Productos",productSchema,"Productos");

export default Product;