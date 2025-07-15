const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path if needed

const router = express.Router();

// POST /api/auth/google-login
router.post('/google-login', async (req, res) => {
  const { name, email, googleId } = req.body;

  if (!name || !email || !googleId) {
    return res.status(400).json({ message: 'Missing Google user data' });
  }

  try {
    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // If not, create new user
      user = await User.create({ name, email, googleId });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Send token and user details
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Google Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
