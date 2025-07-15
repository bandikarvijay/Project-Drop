// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackgroundVideo from './components/BackgroundVideo'; // Optional: if you're using a video background

import Home from './pages/Home';
import Login from './pages/Login';
import Upload from './pages/Upload';
import WebPage from './pages/WebPage';
import DataPage from './pages/DataPage';
import MobilePage from './pages/MobilePage';
import MobilePage from './pages/Modal.js';

function AppLayout() {
  const location = useLocation();
  const noLayoutRoutes = ['/web', '/data', '/mobile'];
  const hideLayout = noLayoutRoutes.includes(location.pathname);

  return (
    <>
      {/* 🔁 Background Video (optional, remove if not using) */}
      <BackgroundVideo />

      {!hideLayout && <Navbar />}

      <div style={{ minHeight: '80vh', padding: '20px', position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/web" element={<WebPage />} />
          <Route path="/data" element={<DataPage />} />
          <Route path="/mobile" element={<MobilePage />} />
          <Route path="/mobile" element={<Modal.js />} />
        </Routes>
      </div>

      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId="598201410354-62188nccr42abbvv35gikqkga1cuidrd.apps.googleusercontent.com">
      <Router>
        <AppLayout />
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
