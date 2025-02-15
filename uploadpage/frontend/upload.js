const express = require('express');
const multer = require('multer');
const path = require('path');
const Video = require('./models/video'); // Presupunând că ai un model Video

const app = express();
const PORT = 5001;

// Parsează corpul cererilor JSON
app.use(express.json());

// Configurare Multer pentru încărcarea fișierelor
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // directorul unde vor fi stocate fișierele
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // schimbă numele fișierului
  }
});

const upload = multer({ storage });

// Endpoint pentru încărcarea videoclipului
app.post('/upload', upload.fields([{ name: 'video' }, { name: 'thumbnail' }]), async (req, res) => {
  try {
    const { title, description, visibility } = req.body;

    if (!req.files['video'] || !req.files['thumbnail']) {
      return res.status(400).json({ message: 'Lipseste videoclipul sau thumbnail-ul' });
    }

    const videoPath = req.files['video'][0].path;
    const thumbnailPath = req.files['thumbnail'][0].path;

    // Creează o nouă intrare în baza de date Video
    const newVideo = new Video({
      title,
      description,
      visibility,
      filePath: videoPath,
      thumbnailPath,
      viewCount: 0, // Inițializăm viewCount cu 0
      likeCount: 0  // Inițializăm likeCount cu 0
    });

    await newVideo.save();

    res.status(200).json({ message: 'Videoclip încărcat cu succes!', video: newVideo });
  } catch (error) {
    console.error('Eroare la încărcarea videoclipului:', error);
    res.status(500).json({ message: 'Eroare la încărcarea videoclipului.' });
  }
});

// Pornirea serverului
app.listen(PORT, () => {
  console.log(`Serverul rulează pe http://localhost:${PORT}`);
});
