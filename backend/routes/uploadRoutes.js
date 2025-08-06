const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

const { uploadProject, getAllProjects, getProjectsByCategory } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

// ensure directories
const base = path.join(__dirname, '..', 'uploads');
const thumbDir = path.join(base, 'thumbnails');
const filesDir = path.join(base, 'files');
if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });
if (!fs.existsSync(filesDir)) fs.mkdirSync(filesDir, { recursive: true });

// multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'thumbnail') cb(null, thumbDir);
    else if (file.fieldname === 'file') cb(null, filesDir);
    else cb(null, base);
  },
  filename: (req, file, cb) => {
    const safe = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, safe);
  }
});
const upload = multer({ storage });

// POST upload (protected)
router.post('/', protect, upload.fields([
  { name: 'thumbnail', maxCount: 20 },
  { name: 'file', maxCount: 1000 }
]), uploadProject);

// GET all projects (public)
router.get('/', getAllProjects);

// GET by category (public) e.g. /api/upload/web
router.get('/:category', getProjectsByCategory);

// GET download zip (protected) - zip project's files and stream
router.get('/:id/download', protect, async (req, res) => {
  try {
    const Project = require('../models/Project');
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (!project.files || project.files.length === 0) {
      return res.status(400).json({ message: 'No files to download' });
    }

    const safeTitle = (project.title || project._id).replace(/\s+/g, '_');
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.zip"`);

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', err => {
      console.error('Archiver error:', err);
      res.status(500).end();
    });
    archive.pipe(res);

    for (const fpath of project.files) {
      // fpath expected like "/uploads/files/filename.ext"
      const rel = fpath.startsWith('/') ? fpath.slice(1) : fpath;
      const full = path.join(__dirname, '..', rel);
      if (fs.existsSync(full) && fs.statSync(full).isFile()) {
        archive.file(full, { name: path.basename(full) });
      } else {
        console.warn('Missing file for zip:', full);
      }
    }

    await archive.finalize();
  } catch (err) {
    console.error('zip error:', err);
    res.status(500).json({ message: 'Server error creating zip' });
  }
});

module.exports = router;
