require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const authRoutes = require('./routes/authRoutes');
const app = express();

// Configurare CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:5500'], // Frontend poate rula pe diferite origini
  methods: ['GET', 'POST'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

// Conectare la MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Database connection error:', err.message);
    process.exit(1); // Oprește serverul dacă baza de date nu funcționează
  });

// Middleware pentru autentificare
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = { userId: decoded.userId }; // Extragem `userId` din token
    next();
  });
};

// Rute pentru autentificare
app.use('/auth', authRoutes);

// Ruta protejată pentru detalii utilizator
app.get('/user-details', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      username: user.username,
      email: user.email,
      userId: user._id,
    });
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Servește fișierele din directorul build (frontend)
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// Pornește serverul
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
