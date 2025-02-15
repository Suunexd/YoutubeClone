const express = require('express');
const multer = require('multer');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5001;

// Enable CORS for all origins
app.use(cors());

// MongoDB Connection URI
const uri = process.env.MONGO_URI || 'your-mongodb-connection-string';
const client = new MongoClient(uri);

// Initialize MongoDB
let db;
client.connect()
  .then(() => {
    db = client.db('videoAppDB');
    console.log('Connected to MongoDB');
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'), // Local upload directory
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

// Middleware for JSON payloads
app.use(express.json());

// Upload endpoint
app.post('/upload', upload.fields([{ name: 'video' }, { name: 'thumbnail' }]), async (req, res) => {
  try {
    const { title, description, visibility } = req.body;

    
    // Save metadata and file path in MongoDB
    const newVideo = {
      title,
      description,
      visibility,
      video: req.files['video'][0].path, // Path where video is saved
      thumbnail: req.files['thumbnail'][0].path, // Path where thumbnail is saved
      uploadedAt: new Date(),
    };

    const result = await db.collection('videos').insertOne(newVideo);

    res.status(201).json({
      message: 'Video uploaded successfully',
      videoId: result.insertedId,
      videoData: newVideo,
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
