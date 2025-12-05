import mongoose from "mongoose";





const pedidoSchema = new mongoose.Schema({
    pedido:[
        {
    productid:{type:String,required:true,unique:true},
    nombre:{type:String,requered:true},
    descripcion:{type:String,requered:true},
    precio:{type:Number,requered:true},
    imagen:{type:String,requered:true},
        }
    ],

    resumenPedido:
        {
        subtotal:{type:Number,requered:true},
        total:{type:Number,requerid:true},
        envio:{type:String}
    }
    ,
    informacionEnvio:
    {
        direccion:{type:String,requerid:true},
        ciudad:{type:String,requerid:true},
        codigoPostal:{type:Number,requerid:true},
        modoPago:{type:String,requerid:true}
    }
    ,
    fechaPedido:
    {
         type: Date, 
         default: Date.now
    }

    
});

//forzamos que me guarde la informacion en la coleccion del sistema

const pedidos=mongoose.model("pedidos",pedidoSchema,"pedidos");

export default pedidos;