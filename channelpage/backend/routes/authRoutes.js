const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = express.Router();

// Înregistrare utilizator
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Toate câmpurile sunt obligatorii.' });
  }

  try {
    // Verificăm dacă utilizatorul există deja
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Utilizatorul există deja.' });
    }

    // Criptăm parola
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creăm utilizatorul
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Creăm token JWT
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Eroare la înregistrare' });
  }
});

// Autentificare utilizator
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Toate câmpurile sunt obligatorii.' });
  }

  try {
    // Căutăm utilizatorul în baza de date
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email sau parolă incorecte.' });
    }

    // Comparăm parola cu cea din baza de date
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email sau parolă incorecte.' });
    }

    // Creăm token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Eroare la autentificare.' });
  }
});

module.exports = router;
