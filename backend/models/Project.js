const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: 'web' },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  thumbnails: [{ type: String }], // stored as "/uploads/thumbnails/filename.jpg"
  files: [{ type: String }],      // stored as "/uploads/files/filename.ext"
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
