import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importăm useNavigate
import './login_page.css'; // Fișierul CSS specific
import logo from './assets/logo2movfara2.png'; // Logo-ul aplicației

function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Mesaj de eroare
  const navigate = useNavigate(); // Definim navigate aici

  // Funcție pentru comutarea între login și register
  const toggleForm = () => {
    setIsRegistering((prev) => !prev);
    setErrorMessage(""); // Resetăm mesajul de eroare când comutăm formularul
  };

  // Funcție de autentificare
  const handleSignIn = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    // Resetăm orice eroare anterioară
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Salvăm token-ul JWT
        localStorage.setItem("token", data.token);
        navigate("/channel"); // Navigăm către pagina de canal
      } else {
        setErrorMessage(data.message || "Eroare necunoscută"); // Afișăm mesajul de eroare
        console.log('Login error response:', data);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("Eroare la autentificare.");
    }
  };

  // Funcție de înregistrare
  const handleRegister = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    // Resetăm orice eroare anterioară
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Cont creat cu succes! Autentificare automată.");
        localStorage.setItem("token", data.token); // Salvăm token-ul JWT
        navigate("/channel"); // Navigăm către pagina de canal
      } else {
        setErrorMessage(data.message || "Eroare necunoscută");
        console.log('Register error response:', data);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMessage("Eroare la înregistrare.");
    }
  };

  // Verificăm dacă utilizatorul este deja autentificat
  const checkAuthentication = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/channel"); // Dacă există un token, redirecționăm utilizatorul
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <div className="login-container">
      <div className="login-card">
        {isRegistering ? (
          <div id="register-section" className="form-section active">
            <img src={logo} alt="Logo" className="logo" />
            <h2>Înregistrare</h2>
            <p>Crează un cont nou</p>
            <form id="register-form" onSubmit={handleRegister}>
              <input
                type="text"
                name="username"
                placeholder="Nume utilizator"
                required
              />
              <input type="email" name="email" placeholder="Email" required />
              <input
                type="password"
                name="password"
                placeholder="Alege o parolă"
                required
              />
              <button type="submit" className="register-button">
                Crează cont
              </button>
            </form>
            <p>
              <button onClick={toggleForm} className="link-button">
                Ai deja un cont? Autentifică-te aici
              </button>
            </p>
          </div>
        ) : (
          <div id="login-section" className="form-section active">
            <img src={logo} alt="Logo" className="logo" />
            <h2>Autentificare</h2>
            <p>Continuă către aplicație</p>
            <form id="login-form" onSubmit={handleSignIn}>
              <input type="email" name="email" placeholder="Email" required />
              <input
                type="password"
                name="password"
                placeholder="Introduceți parola"
                required
              />
              <button type="submit" className="login-button">
                Continuă
              </button>
            </form>
            <p>
              <button onClick={toggleForm} className="link-button">
                Nu ai un cont? Înregistrează-te aici
              </button>
            </p>
          </div>
        )}
        {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Afișăm mesajul de eroare */}
      </div>
    </div>
  );
}

export default LoginPage;

