const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Project = require('../models/Project');
const protect = require('../middleware/auth');

const router = express.Router();

// Ensure upload folders exist
['/uploads/thumbnails', '/uploads/files'].forEach(folder => {
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
});

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'thumbnail') {
      cb(null, '/uploads/thumbnails');
    } else if (file.fieldname === 'file') {
      cb(null, '/uploads/files');  // ✅ Correct path
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueName}${path.extname(file.originalname)}`);
  },
});


const upload = multer({ storage });

/**
 * ✅ POST /api/projects/upload
 * Upload a new project
 */
router.post(
  '/upload',
  protect,
  upload.fields([
    { name: 'thumbnail', maxCount: 10 },
    { name: 'file', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, description, category } = req.body;
      const thumbnails = req.files.thumbnail || [];
      const file = req.files.file?.[0];

      const thumbnailPaths = thumbnails.map((t) => `/uploads/thumbnails/${t.filename}`);
      const fileUrl = file ? `/uploads/files/${file.filename}` : '';

      const project = await Project.create({
        title,
        description,
        category,
        thumbnails: thumbnailPaths,
        fileUrl,
        uploadedBy: req.user.id,
      });

      res.status(201).json(project);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Upload failed' });
    }
  }
);

/**
 * ✅ GET /api/projects
 * Fetch all projects, optionally filtered by category
 * Example: /api/projects?category=Web
 */
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};

    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'name');

    res.json(projects);
  } catch (err) {
    console.error('Fetch failed', err);
    res.status(500).json({ message: 'Fetch failed' });
  }
});

/**
 * ✅ GET /api/projects/mine
 * Fetch projects uploaded by the logged-in user
 */
router.get('/mine', protect, async (req, res) => {
  try {
    const projects = await Project.find({ uploadedBy: req.user.id })
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    console.error('Fetching user projects failed', err);
    res.status(500).json({ message: 'Fetching your projects failed' });
  }
});

module.exports = router;
