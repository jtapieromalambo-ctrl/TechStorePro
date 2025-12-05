import pedidos from "../models/pedidos.js";

export const crearPedido = async (req, res) => {
    try {
        const { pedido, informacionEnvio, resumenPedido, fechaPedido } = req.body;

        // Validar si llega algún producto
        if (!pedido || !Array.isArray(pedido) || pedido.length === 0) {
            return res.status(400).json({ message: "Debe agregar al menos un producto al pedido." });
        }

        // Validación de información de envío
        if (
            !informacionEnvio ||!informacionEnvio.direccion ||!informacionEnvio.ciudad ||!informacionEnvio.codigoPostal ||!informacionEnvio.modoPago
        ) {
            return res.status(400).json({ message: "Todos los campos de envío son obligatorios." });
        }

        // Validación de resumen del pedido
        if (
            !resumenPedido ||
            typeof resumenPedido.subtotal !== "number" ||
            typeof resumenPedido.total !== "number"
        ) {
            return res.status(400).json({ message: "El resumen del pedido es inválido o incompleto." });
        }

        // Crear pedido
        const newPedido = new pedidos({
            pedido,
            informacionEnvio,
            resumenPedido,
            fechaPedido: fechaPedido || new Date()
        });

        // Guardar en BD
        await newPedido.save();

        return res.status(201).json({
            message: "Pedido creado correctamente",
            data: newPedido
        });

    } catch (error) {
        console.error("Error al crear el pedido:", error);
        return res.status(500).json({
            message: "Hubo un error al crear el pedido",
            error: error.message
        });
    }
};