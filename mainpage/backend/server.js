const express = require('express');
const multer = require('multer');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 5000;


const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


app.use(cors());


const uri = process.env.MONGO_URI || 'your-mongodb-connection-string';
const client = new MongoClient(uri);


let db;
client.connect()
  .then(() => {
    db = client.db('videoAppDB');
    console.log('Connected to MongoDB');
  })
  .catch(err => console.error('MongoDB connection error:', err));


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir), 
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'video/mp4' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter 
});


app.use(express.json());


app.post('/upload', upload.fields([{ name: 'video' }, { name: 'thumbnail' }]), async (req, res) => {
  try {
    const { title, description, visibility } = req.body;
    
    if (!req.files || !req.files['video'] || !req.files['thumbnail']) {
      return res.status(400).json({ error: 'Missing video or thumbnail file.' });
    }

   
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
