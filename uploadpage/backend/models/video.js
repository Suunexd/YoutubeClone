const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    visibility: { type: String, enum: ['public', 'private'], required: true },
    filePath: { type: mongoose.Schema.Types.ObjectId, ref: 'fs.files' },  // Referință la GridFS
    thumbnailPath: { type: mongoose.Schema.Types.ObjectId, ref: 'fs.files' },  // Referință la GridFS
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
});

module.exports = mongoose.model('Video', videoSchema);  // Asigură-te că modelul este exportat corect
