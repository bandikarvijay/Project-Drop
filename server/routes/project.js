const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Project = require('../models/Project');
const protect = require('../middleware/auth');

const router = express.Router();

['uploads/thumbnails', 'uploads/files'].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = file.fieldname === 'thumbnail' ? 'uploads/thumbnails' : 'uploads/files';
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const name = `${Date.now()}-${file.originalname}`;
    cb(null, name);
  }
});

const upload = multer({ storage });

router.post('/upload', protect, upload.fields([
  { name: 'thumbnail', maxCount: 10 },
  { name: 'file', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, category } = req.body;
    const file = req.files?.file?.[0];
    const thumbnails = req.files?.thumbnail || [];

    const thumbnailPaths = thumbnails.map(t => `/uploads/thumbnails/${t.filename}`);
    const fileUrl = file ? `/uploads/files/${file.filename}` : '';

    const project = await Project.create({
      title,
      category,
      thumbnails: thumbnailPaths,
      fileUrl,
      uploadedBy: req.user.id
    });

    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

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
