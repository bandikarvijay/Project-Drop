const Project = require('../models/Project');
const path = require('path');
const fs = require('fs');

// Handle upload (protected)
exports.uploadProject = async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!title) return res.status(400).json({ message: 'Title required' });

    // multer puts files in req.files object (fields)
    // thumbnails => req.files['thumbnail']
    // files => req.files['file']
    const thumbs = (req.files && req.files['thumbnail']) || [];
    const files = (req.files && req.files['file']) || [];

    // store public relative paths for each saved file
    const thumbPaths = thumbs.map(f => path.join('/uploads', 'thumbnails', f.filename).replace(/\\/g, '/'));
    const filePaths = files.map(f => path.join('/uploads', 'files', f.filename).replace(/\\/g, '/'));

    const project = new Project({
      title,
      category: category || 'web',
      uploadedBy: req.user ? req.user.id : undefined,
      thumbnails: thumbPaths,
      files: filePaths
    });

    await project.save();

    // Add a downloadZipUrl for convenience (frontend may use it)
    const projectObj = project.toObject();
    projectObj.downloadZipUrl = `/api/upload/${project._id}/download`;

    res.status(201).json(projectObj);
  } catch (err) {
    console.error('uploadProject error:', err);
    res.status(500).json({ message: 'Server error during upload' });
  }
};

// public: get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    // add downloadZipUrl
    const out = projects.map(p => {
      const obj = p.toObject();
      obj.downloadZipUrl = `/api/upload/${p._id}/download`;
      return obj;
    });
    res.json(out);
  } catch (err) {
    console.error('getAllProjects error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// public: get by category
exports.getProjectsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const projects = await Project.find({ category }).sort({ createdAt: -1 });
    const out = projects.map(p => {
      const obj = p.toObject();
      obj.downloadZipUrl = `/api/upload/${p._id}/download`;
      return obj;
    });
    res.json(out);
  } catch (err) {
    console.error('getProjectsByCategory error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
