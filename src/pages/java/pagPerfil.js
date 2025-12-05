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
        const res = await fetch("http://localhost:8081/api/perfil/obtener", {
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
    if (inputs[2]) inputs[2].value = usuario.correo || '';

// telefono
    if (inputs[3]) inputs[3].value = usuario.telefono || '';

// Desabilitar los campos para solo lectura

inputs.forEach(input =>{
    input.disable = true;
    input.classList.add('cursor-not-allowed')
})
 // 3. FUNCIÓN PARA ELIMINAR CUENTA
    configurarBotonEliminar(usuario.correo);
});

// Función para configurar el botón de eliminar
function configurarBotonEliminar(email) {
    const btnEliminar = document.querySelector('a[href="#"]');
    
    if (!btnEliminar) return;

    btnEliminar.addEventListener('click', async (e) => {
        e.preventDefault();
        
        // Mostrar confirmación con doble verificación
        const confirmacion1 = confirm(
            '⚠️ ¿Estás seguro de que deseas eliminar tu cuenta?\n\n' +
            'Esta acción es PERMANENTE y no se puede deshacer.\n' +
            'Perderás todos tus datos, historial de compras y preferencias.'
        );
        
        if (!confirmacion1) return;
        

        // Deshabilitar el botón y mostrar estado de carga
        btnEliminar.style.pointerEvents = 'none';
        btnEliminar.style.opacity = '0.6';
        const textoOriginal = btnEliminar.textContent;
        btnEliminar.textContent = 'Eliminando...';

        try {
            const res = await fetch("http://localhost:8081/api/perfil/eliminar", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.mensaje || "Error al eliminar la cuenta");
            }

            // Éxito: Limpiar datos y redirigir
            alert('✅ Tu cuenta ha sido eliminada exitosamente.');
            
            // Limpiar toda la información del localStorage
            localStorage.clear();
            
            // Redirigir al inicio o página de registro
            window.location.href = "../pages/index.html";

        } catch (err) {
            console.error("Error al eliminar cuenta:", err);
            
            // Restaurar el botón
            btnEliminar.style.pointerEvents = 'auto';
            btnEliminar.style.opacity = '1';
            btnEliminar.textContent = textoOriginal;
            
            // Mostrar error al usuario
            alert(
                '❌ Error al eliminar la cuenta\n\n' +
                err.message + '\n\n' +
                'Por favor, intenta nuevamente o contacta con soporte.'
            );
        }
    });
}

