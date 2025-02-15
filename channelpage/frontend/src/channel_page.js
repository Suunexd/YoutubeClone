import React, { useEffect, useState, useCallback } from "react";
import './channel_page.css';
import logo from './assets/logo2movfara2.png';
import { useNavigate } from 'react-router-dom';

function ChannelPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false); // Starea pentru meniul burger
  
  const navigate = useNavigate();

  // Funcția pentru a adresa login-ul și a obține datele utilizatorului
  const fetchUserDetails = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not logged in!");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/user-details", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setUser(data); // Setează detaliile utilizatorului
        setLoading(false); // Setează încărcarea la false după ce se primesc datele
      } else {
        alert("Failed to fetch user details");
        navigate("/login");
        setLoading(false); // Opriți încărcarea și navigați la login în caz de eroare
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      alert("An error occurred while fetching user details.");
      setLoading(false); // Setează încărcarea la false chiar dacă apare o eroare
    }
  }, [navigate]);

  // Folosim useEffect pentru a încărca datele la montarea paginii
  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]); // Asigură-te că `fetchUserDetails` este inclus în array-ul de dependențe

  return (
    <div className="youtube-page">
      {/* Sidebar container including logo */}
      <div className="sidebar-container">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
          <span className="logo-text">TUBIFY</span>
        </div>
        
        <div className="sidebar">
          <ul className={`menu ${menuOpen ? "menu-show" : ""}`}>
            <li className="menu-item">Home</li>
            <li className="menu-item">Search</li>
            <li className="menu-item">Top Videos</li>
            <li className="menu-item">Account</li>
            <li className="menu-item">Settings</li>
          </ul>
        </div>
      </div>

      {/* Burger Button */}
      <button
        className={`burger-button ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className="burger-bar"></span>
        <span className="burger-bar"></span>
        <span className="burger-bar"></span>
      </button>

      {/* Main Content */}
      <main className="content">
        <div className="channel-info">
          {/* Afișăm un mesaj de încărcare până când utilizatorul este încărcat */}
          {loading ? (
            <div>Loading user details...</div> // Sau un spinner, dacă vrei
          ) : (
            <>
              <div className="profile-pic">{user ? user.username[0] : 'U'}</div>
              <div className="channel-details">
                <h2>{user ? user.username : 'Loading...'}</h2>
                <p>{user ? user.email : 'Loading email...'}</p>
                <div className="buttons">
                  <button onClick={() => alert('Personalizează canalul')}>
                    Personalizează canalul
                  </button>
                  <button onClick={() => alert('Gestionează videoclipurile')}>
                    Gestionează videoclipurile
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="videos">
          <h3>Videoclipuri</h3>
          <div className="video-card">
            <img
              src="https://via.placeholder.com/300x150"
              alt="Videoclip"
              className="video-thumbnail"
            />
            <div className="video-info">
              <h4>
                COLEGIUL NAȚIONAL "ALEXANDRU VLAHUȚĂ" - PROMOȚIA 2019-2020
              </h4>
              <p>901 vizionări · acum 1 an</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ChannelPage;
