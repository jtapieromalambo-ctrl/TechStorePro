import Productos from "../models/Productos.js";


// crear productos

export const crearProducto= async(req,res)=>{
        try {
        const{productid,nombre,descripcion,precio,imagen}=req.body;

        const newProduct = new Productos({
            productid,
            nombre,
            descripcion,
            precio,
            imagen
        });
        await newProduct.save();
        res.status(201).json({mesagge:"producto guardado con exito"});
    } catch (error) {
        console.error("Error al guardar el producto", error.message);
        res.status(400).json({ message: "Error al crear el producto" });
    }
};


//traer los datos de la base de datos
export const obtenerProductos= async (req,res)=>{
    try {
        const productos = await Productos.find();
        res.json(productos);
    } catch (error) {
      res.status(500).json({mesagge:"Error al obtener los productos"});  
    }
};
export default Productos;