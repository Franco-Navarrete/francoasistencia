import { auth, signInWithEmailAndPassword } from "./firebase.js";

document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("msg");

    if (!email || !password) {
        msg.textContent = "Completa todos los campos";
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "dashboard.html"; // 🔥 Redirección exitosa
    } catch (error) {
        console.log(error);
        if (error.code === "auth/wrong-password") msg.textContent = "Contraseña incorrecta";
        else if (error.code === "auth/user-not-found") msg.textContent = "Usuario no registrado";
        else if (error.code === "auth/invalid-email") msg.textContent = "Email inválido";
        else if (error.code === "auth/too-many-requests") msg.textContent = "Intentos agotados. Espera un momento";
        else msg.textContent = "Error al iniciar sesión";
    }
});
