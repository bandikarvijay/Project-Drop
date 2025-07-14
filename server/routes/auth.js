const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// POST /api/auth/google-login
router.post('/google-login', async (req, res) => {
  const { name, email, googleId } = req.body;

  if (!name || !email || !googleId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    let user = await User.findOne({ googleId });

    // Create new user if not exists
    if (!user) {
      user = new User({ name, email, googleId });
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Google Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
