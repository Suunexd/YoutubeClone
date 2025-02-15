// Elemente HTML
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const goToRegister = document.getElementById('go-to-register');
const goToLogin = document.getElementById('go-to-login');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const registerMessage = document.getElementById('register-message');

// Funcție pentru a schimba între login și register
function switchToRegister() {
    loginSection.classList.remove('active');
    registerSection.classList.add('active');
}

function switchToLogin() {
    registerSection.classList.remove('active');
    loginSection.classList.add('active');
}

// Gestionarea navigării între login și register
goToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    switchToRegister();
});

goToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    switchToLogin();
});

console.log("Script loaded");

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(email, password); // Debugging

    if (email === 'existent@example.com' && password === '12345') {
        alert('Logged in successfully!');
    } else {
        alert('Invalid email or password. Try again!');
    }
});


// Formular de register
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const registerEmail = document.getElementById('register-email').value;
    const registerPassword = document.getElementById('register-password').value;

    // Simulăm crearea unui cont cu succes
    if (registerEmail && registerPassword) {
        registerMessage.textContent = 'Account created successfully!';
        registerMessage.style.color = 'green';
        setTimeout(() => switchToLogin(), 2000); // Întoarcere la login după 2 secunde
    } else {
        registerMessage.textContent = 'Please fill in all fields.';
        registerMessage.style.color = 'red';
    }
});
