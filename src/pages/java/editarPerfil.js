document.addEventListener("DOMContentLoaded", async () => {
    const sesionActiva = localStorage.getItem("sesionActiva");
    const icono = document.getElementById("icono-inicio");

    if (sesionActiva && icono) {
        icono.classList.add("hidden");
    }
    // sesion activa 

    if (!sesionActiva) {
        window.location.href = "../pages/login.html";
        return;
    }



    // vamos traer los datos de la base

    const perfil = JSON.parse(localStorage.getItem("usuario"));
    if (!perfil || !perfil.correo) {
        window.location.href = "../pages/login.html";
        return;
    }



    let usuario = null;

    try {
        const res = await fetch("https://techstorepro-67te.onrender.com/api/perfil/obtener", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: perfil.correo })
        });

        const data = await res.json();
        if (!res.ok) throw new Error("No se pudo obtener perfil");
        usuario = data.usuario;
    } catch (err) {
        console.error(" Error la obtener el perfil", err);

        // cerrar sesion fallida 

        localStorage.clear();
        window.location.href = "../pages/login.html";
        return;

    }

    // 3. INSERTAR DATOS EN EL MENÚ

    document.getElementById("user-name").textContent =
        `${usuario.nombre} ${usuario.apellidos}`;

    document.getElementById("user-email").textContent = usuario.correo;

    const avatar = `${usuario.nombre[0]}${usuario.apellidos[0]}`.toUpperCase();
    document.getElementById("user-avatar").textContent = avatar;


    //llenar los campos del formulario
    const inputs = document.querySelectorAll("form input");


    // nombre
    if (inputs[0]) inputs[0].value = usuario.nombre || '';

// apellidos
    if (inputs[1]) inputs[1].value = usuario.apellidos || '';

// correo
    if (inputs[2]) {
     inputs[2].value = usuario.correo || '';
    inputs[2].disable = true;
    inputs[2].classList.add('cursor-not-allowed', 'bg-gray-200')
    }

// telefono
    if (inputs[3]) inputs[3].value = usuario.telefono || '';

//manejar el envio del formulario

 const formulario = document.querySelector("form");
    
    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = inputs[0].value.trim();
        const apellidos = inputs[1].value.trim();
        const telefono = inputs[3].value.trim();

        // Validar campos
        if (!nombre || !apellidos || !telefono) {
            alert("Por favor, completa todos los campos obligatorios");
            return;
        }

        try {
            const res = await fetch("https://techstorepro-67te.onrender.com/api/perfil/actualizar", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: usuario.correo,
                    nombre: nombre,
                    apellidos: apellidos,
                    telefono: telefono
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Error al actualizar perfil");
            }

            // Actualizar localStorage
            const usuarioActualizado = {
                correo: usuario.correo,
                nombre: data.usuario.nombre,
                apellidos: data.usuario.apellidos,
                telefono: data.usuario.telefono
            };
            localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));

            // Mostrar mensaje de éxito
            alert("✅ Perfil actualizado exitosamente");

            // Redirigir a la página de perfil
            window.location.href = "./perfil.html";

        } catch (err) {
            console.error("Error al actualizar perfil:", err);
            alert("❌ " + err.message);
        }
    });
});

