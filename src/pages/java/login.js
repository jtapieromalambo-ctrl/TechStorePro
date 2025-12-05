//script de login - TechStore Pro

document.addEventListener('DOMContentLoaded', function () {
    console.log('✅ pagina cargada correctamente - Sistema listo')

    const API_URL = "http://localhost:8081/api/login"

    document.getElementById('login-form').addEventListener('submit', async function (e) {
        e.preventDefault()

        const btn = document.getElementById('login-btn')
        const errorDiv = document.getElementById('login-error')
        const errorMsg = document.getElementById('login-error-message')

        errorDiv.classList.add('hidden')

        const datos = {
            correo: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value
        }

        if (!datos.correo || !datos.password) {
            errorMsg.textContent = 'Por favor completar datos'
            errorDiv.classList.remove('hidden')
            return
        }

        btn.disabled = true
        btn.textContent = 'Iniciando sesión...'

        try {

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            })

            // --- Comprobación de que el servidor devolvió JSON válido ---
            const rawText = await response.text()
            let resultado

            try {
                resultado = JSON.parse(rawText)
            } catch (e) {
                console.error("❌ El servidor NO devolvió JSON válido:", rawText)
                throw new Error("Respuesta inválida del servidor")
            }
            // -------------------------------------------------------------

            if (response.ok) {
                console.log('201 - Inicio de sesión exitoso')

                //guardar información
                localStorage.setItem("sesionActiva", "true")
                localStorage.setItem("usuario", JSON.stringify({
                    id: resultado.usuario._id,
                    nombre: resultado.usuario.nombre,
                    apellidos: resultado.usuario.apellidos,
                    telefono: resultado.usuario.telefono,
                    correo: resultado.usuario.correo,
                    password: resultado.usuario.password
                }))

                //mensaje de exito
                errorDiv.className = 'bg-green-50 border-green-200 text-green-800 px-4 py-3 rounded-lg'
                errorMsg.textContent = 'Inicio de sesión, Redirigiendo...'
                errorDiv.classList.remove('hidden')

                setTimeout(() => window.location.href = 'productos.html', 700)

            } else {
                //error de credenciales o error desde backend
                errorMsg.textContent = resultado.message || 'Credenciales incorrectas'
                errorDiv.classList.remove('hidden')
                btn.disabled = false
                btn.textContent = 'Iniciar sesión'
            }

        } catch (error) {

            console.error('❌ Error de conexión con el servidor:', error)
            errorMsg.textContent = 'Error de conexión con el servidor'
            errorDiv.classList.remove('hidden')
            btn.disabled = false
            btn.textContent = 'Iniciar sesión'
        }

    })

})
