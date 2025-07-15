const jwt = require('jsonwebtoken');
const User = require('../models/User'); // or wherever your User model is

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password'); // 🟢 This sets req.user
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = protect;
