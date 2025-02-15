const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const path = require('path');
const Video = require('../models/video');

// Configurare GridFS
const conn = mongoose.createConnection(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let gfs;

conn.once('open', () => {
    // Inițializează GridFS pentru a interacționa cu fișierele
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads'); // Setează colecția pentru fișiere
});

const storage = multer.memoryStorage(); // Folosește memorie în loc de fișiere pe disc
const upload = multer({ storage });

// Ruta de upload a videoclipului
router.post('/upload', upload.fields([{ name: 'video' }, { name: 'thumbnail' }]), async (req, res) => {
    try {
        console.log(req.files); // Vezi fișierele încărcate

        // Verifică dacă fișierele video și thumbnail sunt prezente
        if (!req.files['video'] || !req.files['thumbnail']) {
            return res.status(400).json({ message: 'Lipseste videoclipul sau thumbnailul' });
        }

        const { title, description, visibility } = req.body;

        // Încarcă fișierul video în GridFS
        const videoFile = req.files['video'][0];
        const videoStream = gfs.createWriteStream({
            filename: `${Date.now()}-${videoFile.originalname}`,
            content_type: videoFile.mimetype,
        });

        videoStream.write(videoFile.buffer);
        videoStream.end();

        // Încarcă fișierul thumbnail în GridFS
        const thumbnailFile = req.files['thumbnail'][0];
        const thumbnailStream = gfs.createWriteStream({
            filename: `${Date.now()}-${thumbnailFile.originalname}`,
            content_type: thumbnailFile.mimetype,
        });

        thumbnailStream.write(thumbnailFile.buffer);
        thumbnailStream.end();

        // Așteaptă să se termine încărcarea fișierelor
        await new Promise((resolve, reject) => {
            videoStream.on('close', resolve);
            videoStream.on('error', reject);
        });

        await new Promise((resolve, reject) => {
            thumbnailStream.on('close', resolve);
            thumbnailStream.on('error', reject);
        });

        // Salvează metadatele videoclipului în MongoDB
        const views = Math.floor(Math.random() * 10000) + 1; // Vizionări random între 1 și 10.000
        const likes = Math.floor(Math.random() * views) + 1; // Like-uri random între 1 și numărul de vizionări

        const newVideo = new Video({
            title,
            description,
            visibility,
            filePath: videoStream.id, // ID-ul fișierului video salvat în GridFS
            thumbnailPath: thumbnailStream.id, // ID-ul fișierului thumbnail salvat în GridFS
            views, // Adaugă numărul de vizionări
            likes, // Adaugă numărul de like-uri
        });

        await newVideo.save();

        // Răspuns succes
        res.status(200).json({ message: 'Videoclip incarcat cu succes!', video: newVideo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare la incarcarea videoclipului.' });
    }
});

module.exports = router;
