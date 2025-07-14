const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ✅ CORS Middleware (Updated to allow frontend requests)
app.use(cors({
  origin: 'https://project-drop-five.vercel.app', // React frontend
  credentials: true
}));

// Middleware to parse JSON requests
app.use(express.json());

// ✅ Serve static files (e.g. project uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ API Routes
const authRoutes = require('./routes/auth'); // Google login
const projectRoutes = require('./routes/project'); // Project uploads

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// ✅ Test route to confirm server is running
app.get('/', (req, res) => {
  res.send('✅ Project Drop API is running...');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
