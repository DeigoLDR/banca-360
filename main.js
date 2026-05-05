// --- LÓGICA DEL MODO OSCURO / CLARO ---
const themeToggleBtn = document.getElementById('theme-toggle');
const bodyElement = document.body;

themeToggleBtn.addEventListener('click', () => {
    // Verificamos si el atributo actual es 'dark'
    if (bodyElement.getAttribute('data-theme') === 'dark') {
        bodyElement.removeAttribute('data-theme'); // Volvemos al modo claro
    } else {
        bodyElement.setAttribute('data-theme', 'dark'); // Activamos el modo oscuro
    }
});

// --- LÓGICA DE VALIDACIÓN DEL REGISTRO ---
const registerForm = document.getElementById('register-form');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const errorMessage = document.getElementById('error-message');

registerForm.addEventListener('submit', (evento) => {
    // Prevenimos que la página se recargue al enviar el formulario
    evento.preventDefault();
    
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // 1. Validar que la contraseña tenga al menos 6 caracteres y sean SOLO números
    const esSoloNumeros = /^\d{6,}$/.test(password);

    if (!esSoloNumeros) {
        errorMessage.textContent = "Error: La contraseña debe tener al menos 6 caracteres y ser exclusivamente numérica.";
        return; // Detenemos la ejecución
    }

    // 2. Validar que ambas contraseñas coincidan
    if (password !== confirmPassword) {
        errorMessage.textContent = "Error: Las contraseñas no coinciden.";
        return; // Detenemos la ejecución
    }

    // Si pasa las validaciones:
    errorMessage.textContent = "";
    errorMessage.style.color = "green";
    errorMessage.textContent = "¡Registro exitoso! Validaciones correctas.";
    
    // Aquí más adelante agregarás la lógica para guardar el usuario (ej: localStorage)
    // y redirigir a la configuración de preguntas de seguridad.
});