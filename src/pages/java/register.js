document.addEventListener("DOMContentLoaded",()=>{
    const form = document.getElementById("register-form")

    form.addEventListener("submit", async (e) =>{
        e.preventDefault()

        const password = document.getElementById("password").value
        const confirmar = document.getElementById("co-password").value


        //valida la contraseña
        if (password !== confirmar) {
            Swal.fire({
                icon:"error",
                title: "contraseñas no coinciden",
                html:"<b> por favor verificar que ambas contraseñas sean iguales</b>",
                background: "#1e293b",
                color: "#fff",
                confirmButtonColor: "#10b981",
            })
            return
        }
        const data ={
            nombre: document.getElementById("nombre").value,
            apellidos: document.getElementById("apellidos").value,
            telefono: document.getElementById("telefono").value,
            correo: document.getElementById("correo").value,
            password: document.getElementById("password").value
        }
        try {
            const res = await fetch( "http://localhost:8081/api/User/register",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
        
        })

        if (!res.ok){
            const errData = await res.json()
            throw new Error(errData.message || "Error al registrar usuario")
        }

        const json = await res.json()
        console.log("Respuesta del servidor:", json)

         Swal.fire({
        icon: "success",
        title: " ¡Si sale esto todo bien!",
        text: "Ahora se puede iniciar sesión espere 2 segundos.",
        timer:2000,
        timerProgressBar:true,
        showConfirmButton: false,
        confirmButtonColor: "#10b981",
        showClass: {
          popup: "animate_animated animate_zoomIn"
        },
        hideClass: {
          popup: "animate_animated animate_zoomOut"
        }
      }).then(() => {
        window.location.href = "login.html";
      });

      form.reset()


        } catch (error) {
            console.error("Error",error)
            alert(error.message)
        }
    })
})