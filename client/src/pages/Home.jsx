import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function TypewriterText() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => setVisible(true), 50); // short reset delay
    }, 4000); // loop every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return visible ? <h1 className="typewriter-heading">Project Drop!</h1> : null;
}

function Home() {
  const navigate = useNavigate();

  const handleCategoryClick = (route) => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate(route);
    } else {
      navigate('/login', { state: { redirectTo: route } });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* 🔥 Logo and Typewriter */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <img
          src="/images/pd logo.png"
          alt="Logo"
          style={{ width: '50px', height: '50px', objectFit: 'contain' }}
        />
        <TypewriterText />
      </div>

      <p style={{
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto 40px',
        lineHeight: '1.7',
        color: '#fff',
        fontSize: '1.1rem'
      }}>
        <span style={{ color: '#a93e0b' }}>Project Drop</span> is a collaborative platform designed to help students share and explore academic project work.
        It allows students to upload their own <span style={{ color: '#a93e0b' }}>final-year</span> or <span style={{ color: '#a93e0b' }}>semester projects</span> so that others can use them as references
        for inspiration, learning, or idea development. By creating a centralized and open-access space for academic projects,
        <span style={{ color: '#a93e0b' }}> Project Drop </span> promotes knowledge sharing, peer learning, and innovation among students.
      </p>

      <div className="category-boxes">
        <div className="category-card" onClick={() => handleCategoryClick('/web')}>
          <img src="/images/web.png" alt="Web Applications" />
          <h3>Web Applications</h3>
        </div>

        <div className="category-card" onClick={() => handleCategoryClick('/data')}>
          <img src="/images/data.png" alt="Data Science" />
          <h3>Data Science</h3>
        </div>

        <div className="category-card" onClick={() => handleCategoryClick('/mobile')}>
          <img src="/images/mobile.png" alt="Mobile App" />
          <h3>Mobile App</h3>
        </div>
      </div>
    </div>
  );
}

export default Home;
