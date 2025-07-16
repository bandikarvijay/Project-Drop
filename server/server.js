const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

dotenv.config();
connectDB();

const app = express();

// ✅ Add this before any routes
app.use(cors({
  origin: 'https://project-drop-five.vercel.app', // 🔁 Replace with your frontend Vercel domain
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Add security headers to allow Google login/popups
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

// Parse JSON
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure folders
['uploads/files', 'uploads/thumbnails'].forEach(folder => {
  const folderPath = path.join(__dirname, folder);
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/project'));

app.get('/', (req, res) => {
  res.send('✅ Project Drop API is running...');
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
