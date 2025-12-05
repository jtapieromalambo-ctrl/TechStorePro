document.addEventListener("DOMContentLoaded", async () => {
    const sesionActiva = localStorage.getItem("sesionActiva");
    const contenedor = document.getElementById("user-menu-container");
    const icono = document.getElementById("icono-inicio");

    if (sesionActiva && icono) {
        icono.classList.add("hidden");
    }
    // si no extiste el contenedor 
    if (!contenedor) return;

    // sesion activa 

    if (!sesionActiva) return;


    // ✔️ OCULTAR ICONO SI HAY SESIÓN ACTIVA


    // --- el resto de tu código sigue igual ---


    // vamos traer los datos de la base

    const perfil = JSON.parse(localStorage.getItem("usuario"));
    if (!perfil || !perfil.correo) return;

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
    // Crear el menu del usuario 
    contenedor.innerHTML = `
    <div class ="relative">
       <button id="user-menu-btn"
            class="w-12 h-12 p-5 rounded-full bg-linear-to-r from-blue-600 to-purple-600 text-white 
                       flex items-center justify-center font-bold text-lg shadow-lg 
                       hover:scale-110 hover:shadow-xl transition-all duration-200 
                       focus:outline-none focus:ring-2 focus:ring-blue-400">
                <span id="user-avatar"></span>
        </button>

    <div id= "user-dropdown"
    class="hidden absolute right-4 mt-2 w-60  rounded-xl bg-white shadow-xl/30 border-gray-100 py-2  z-50 transition-all duration-200  ease-out overflow-hidden transform origin-top scale-95 opacity-0">
    <div class="px-4 py-3 border-b border-gray-200 ">
                    <p class="text-sm font-semibold text-gray-900" id="user-name"></p>
                    <p class="text-xs text-gray-500" id="user-email"></p>
                </div>

                <a href="../pages/perfil.html"
                    class="flex items-center px-4 py-3 text-sm text-gray-700 
                           hover:bg-blue-100 hover:text-blue-800 
                           active:bg-blue-200 transition-all duration-150 rounded-md cursor-pointer">
                    Mi Perfil
                </a>

                <button id="logout-btn"
                    class="flex items-center w-full px-4 py-3 text-sm text-gray-600 
                           hover:bg-red-300 hover:text-red-800 
                           active:bg-blue-200 transition-all duration-150 rounded-md cursor-pointer">
                    Cerrar sesión
                </button>
            </div>
        </div> 
    `;
    // 3. INSERTAR DATOS EN EL MENÚ

    document.getElementById("user-name").textContent =
        `${usuario.nombre} ${usuario.apellidos}`;

    document.getElementById("user-email").textContent = usuario.correo;

    const avatar = `${usuario.nombre[0]}${usuario.apellidos[0]}`.toUpperCase();
    document.getElementById("user-avatar").textContent = avatar;


    //  4. ANIMACIÓN ABRIR/CERRAR

    document.getElementById("user-menu-btn").addEventListener("click", () => {
        const drop = document.getElementById("user-dropdown");

        if (drop.classList.contains("hidden")) {
            drop.classList.remove("hidden");

            setTimeout(() => {
                drop.classList.remove("opacity-0", "scale-95");
                drop.classList.add("opacity-100", "scale-100");
            }, 20);

        } else {
            drop.classList.remove("opacity-100", "scale-100");
            drop.classList.add("opacity-0", "scale-95");

            setTimeout(() => {
                drop.classList.add("hidden");
            }, 150);
        }
    });

});



// 5. CERRAR SESIÓN + TOAST

document.addEventListener("click", (e) => {
    if (e.target.id === "logout-btn") {

        localStorage.clear();

        const toast = document.getElementById("logout-toast");

        toast.classList.remove("hidden");
        setTimeout(() => toast.classList.add("opacity-100"), 20);

        setTimeout(() => {
            toast.classList.remove("opacity-100");
            setTimeout(() => {
                window.location.href = "../pages/login.html";
            }, 500);
        }, 1500);
    }


});