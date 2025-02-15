import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './login_page'; // Verifică că această cale este corectă
import ChannelPage from './channel_page'; // Verifică că această cale este corectă

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* Pagina de login */}
        <Route path="/channel" element={<ChannelPage />} /> {/* Pagina de canal */}
      </Routes>
    </Router>
  );
}

export default App;

