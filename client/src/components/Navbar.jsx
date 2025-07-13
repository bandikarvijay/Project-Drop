import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const token = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <nav style={{
      padding: '10px 20px',
      background: 'transparent', // ✅ transparent background
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      color: '#a93e0b',            // ✅ white text for visibility on video
      zIndex: 2,
      position: 'relative',
    }}>
      {/* ✅ Logo Image */}
      <img
        src="/images/pd logo.png"
        alt="Logo"
        style={{ width: '40px', height: '40px', objectFit: 'contain' }}
      />

      <h2 style={{ margin: 0 }}>Project Drop</h2>
    </nav>
  );
}

export default Navbar;
