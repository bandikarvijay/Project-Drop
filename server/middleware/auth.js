const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user and attach to request
      req.user = await User.findById(decoded.id).select('-password');
      return next(); // ✅ go to next middleware
    } catch (err) {
      console.error('Token verification failed:', err);
      return res.status(401).json({ message: 'Not authorized' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
};

module.exports = protect;
