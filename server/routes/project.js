const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Project = require('../models/Project');
const protect = require('../middleware/auth');

const router = express.Router();

// Ensure folders exist
['uploads/thumbnails', 'uploads/files'].forEach(f => {
  if (!fs.existsSync(f)) fs.mkdirSync(f, { recursive: true });
});

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,
      file.fieldname === 'thumbnail'
        ? 'uploads/thumbnails'
        : 'uploads/files'
    );
  },
  filename: (req, file, cb) => {
    cb(null, Date.now()+'-'+Math.random().toString().slice(2)+path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post('/upload', protect, upload.fields([
  { name: 'thumbnail', maxCount: 10 },
  { name: 'file', maxCount: 1 },
]), async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const thumbnails = req.files.thumbnail || [];
    const file = req.files.file?.[0];
    const thumbnailPaths = thumbnails.map(t => `/uploads/thumbnails/${t.filename}`);
    const fileUrl = file ? `/uploads/files/${file.filename}` : '';
    const project = await Project.create({
      title, description, category, thumbnails: thumbnailPaths,
      fileUrl, uploadedBy: req.user.id
    });
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Get projects optionally filtered by category
router.get('/', async (req, res) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'name');
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Fetch failed' });
  }
});

// Get only current user's projects
router.get('/mine', protect, async (req, res) => {
  try {
    const projects = await Project.find({ uploadedBy: req.user.id })
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Fetch user projects failed' });
  }
});

module.exports = router;
