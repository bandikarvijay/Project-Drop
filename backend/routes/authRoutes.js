// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Ensure uploads/users directory exists
const usersUploadDir = path.join(__dirname, '..', 'uploads', 'users');
if (!fs.existsSync(usersUploadDir)) {
  fs.mkdirSync(usersUploadDir, { recursive: true });
}

// multer storage for user images
const userStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, usersUploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const uploadUser = multer({ storage: userStorage });

// Register (multipart/form-data if image included)
router.post('/register', uploadUser.single('image'), registerUser);

// Login (expects JSON body: { email, password })
router.post('/login', loginUser);

// Protected: get current user
router.get('/me', protect, getMe);

module.exports = router;
