// index.js (updated)
// I kept all your original code and only added a root route and a basic error handler.

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const uploadRoutes = require('./routes/uploadRoutes');
// 🔹 Add this: Auth routes
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/upload', uploadRoutes);
// 🔹 Add this: Auth route
app.use('/api/auth', authRoutes);

// health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// root route so visiting / doesn't return "Cannot GET /"
app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

// basic 404 for API routes not found
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// basic error handler (so stack traces are logged)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server started on port', PORT);
});
