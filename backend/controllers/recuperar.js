import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import user from "../models/user.js";



const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})
// funcion de generar codigo de 6 digitos

const generarCodigo =()=>{
    return Math.floor(100000 + Math.random()*90000).toString()
}

// 1.solicitar codigo de recuperacion

export const solicitarCodigo = async (req, res)=>{
try {
    const {correo} = req.body
    if (!correo){
        return res.status(400).json({
            message: "El correo electronico es obligatorio"
        })
    }
    // Busar usuario
    const usuario = await user.findOne({correo})

    if (!usuario) {
        return res.status(400).json({
            message: "Correo electronico no encontrado"
        })
    }

    //generar codigo de 6 digitos
    const codigo = generarCodigo()
    usuario.codigoExpiracion = Date.now() + 900000 // 15 minutos

    //Guardar codigo con expiracion de 15 minutos
    usuario.codigoRecuperacion = codigo
    
    await usuario.save()

    const mailOptions= {
        from: 'jtapieromalambo@gmail.com',
        to: usuario.correo,
        subject: 'Codigo de recuperación - TechStore Pro',
        html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #4F46E5; margin: 0;">TechStore Pro</h2>
        </div>

        <h3 style="color: #333;">Recuperación de Contraseña</h3>

        <p>Hola <strong>${usuario.nombre}</strong>,</p>

        <p>Recibimos una solicitud para restablecer tu contraseña.</p>

        <p>Tu código de verificación es:</p>

        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 20px;
                    border-radius: 10px;
                    text-align: center;
                    margin: 30px 0;">
            <h1 style="color: black;
                       font-size: 36px;
                       letter-spacing: 8px;
                       margin: 0;
                       font-family: monospace;">
                ${codigo}
            </h1>
        </div>

        <p style="color: #666; font-size: 14px;">
            ⏱️ Este código expirará en <strong>15 minutos</strong>.
        </p>

        <p style="color: #666; font-size: 14px;">
            🔒 Si no solicitaste este cambio, ignora este email y tu contraseña permanecerá segura.
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">

        <p style="color: #999; font-size: 12px; text-align: center;">
            © 2025 TechStore Pro – Tu tienda de tecnología de confianza
        </p>
    </div>
`
        
    }



    // enviar Email
    await transporter.sendMail(mailOptions)

    console.log(`Codugo enviado a ${usuario.correo}:${codigo}`)

    res.status(200).json({
        message:"Si el correo existe, recibirás un código de verificación",

    })


} catch (error) {
    console.error("Erro al enviar codigo:", error)
    res.status(500).json({
        message:"Error al procesar la solicitud",
        error: error.message
    })
    
}
}
// 2.VERIFICAR CODIGO Y CAMBIAR CONTRASEÑA

export const cambiarPassword = async (req, res)=>{
    try {
        const {correo, codigo, nuevaPassword} = req.body
        //validacion

        if(!correo || !codigo || !nuevaPassword ){
            return res.status(400).json({
                message:"Todos los campos son obligatorios"
            })
        }
        if (nuevaPassword.length < 6){
            return res.status(400).json({
                message:"La contraseña debe tener al menos 6 caracteres"
            })
        }

        // buscar usuario
                const usuario = await user.findOne({ 
            correo,
            codigoRecuperacion: codigo,
            codigoExpiracion: { $gt: Date.now() }
        });

        if (!usuario) {
            const usuarioDebug = await user.findOne({ correo });
            if (usuarioDebug) {
                console.log('⚠️ Código no coincide:');
                console.log('  - Código en BD:', usuarioDebug.codigoRecuperacion);
                console.log('  - Código recibido:', codigo);
                console.log('  - Expiró:', usuarioDebug.codigoExpiracion < Date.now());
            }
            return res.status(400).json({
                message: "Código inválido o expirado"
            });
        }
// encriptar nueva contraseña

const salt = await bcrypt.genSalt(10)
const hasheadPassword = await bcrypt.hash(nuevaPassword, salt)


// Actualizar contraseña y limpiar codigo

usuario.password = hasheadPassword
usuario.codigoRecuperacion = undefined
usuario.codigoExpiracion = undefined
await usuario.save()

// Email de confirmacion

const mailOptions = {
    from:'jtapieromalambo@gmail.com',
    to: usuario.correo,
    subject: 'Código de recuperacion - TechStore Pro',
    html:`
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #4F46E5; margin: 0;">TechStore Pro</h2>
    </div>

    <h3 style="color: #333;">Recuperación de Contraseña</h3>

    <p>Hola <strong>${usuario.nombre}</strong>,</p>

    <p>Recibimos una solicitud para restablecer tu contraseña.</p>

    <p>Tu código de verificación es:</p>

    <div style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        margin: 30px 0;">
        
        <h1 style="
            color: black;
            font-size: 36px;
            letter-spacing: 8px;
            margin: 0;
            font-family: monospace;">
            ${codigo}
        </h1>
    </div>

    <p style="color: #666; font-size: 14px;">
        ⏱ Este código expirará en <strong>15 minutos</strong>.
    </p>

    <p style="color: #666; font-size: 14px;">
        🔒 Si no solicitaste este cambio, ignora este email y tu contraseña permanecerá segura.
    </p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">

    <p style="color: #999; font-size: 12px; text-align: center;">
        © 2025 TechStore Pro – Tu tienda de tecnología de confianza
    </p>
</div>
    `
}

// enviar email

await transporter.sendMail(mailOptions)

console.log(`Codigo enviado a ${usuario.correo}: ${codigo}`)

res.status(200).json({
    message:"Si el correo existe, recibirás un código de verificación"
})

    } catch (error) {
        console.error("Error al cambiar contraseña:", error)
        res.status(500).json({
            message:"Error al cambiar la contraseña",
            error:error.message
        })
    }
}

