// src/components/MainPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './MainPage.css';
import TrueFocus from './TrueFocus/TrueFocus.jsx';
import DarkVeil from '../DarkVeil/DarkVeil.jsx';
import Dock from './Dock/Dock.jsx';
import { VscProject } from 'react-icons/vsc';
import TextType from './TextType/TextType.jsx'; 

// icons
import { VscMail, VscLink, VscGlobe, VscGithub } from 'react-icons/vsc';

function MainPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const onDocClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'userInfo') {
        const val = localStorage.getItem('userInfo');
        setUser(val ? JSON.parse(val) : null);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setUser(null);
    setOpen(false);
  };

const profileSrc = () => {
  if (!user || !user.image) return '/profile.png';

  const isExternal = user.image.startsWith('http') || user.image.startsWith('https');
  if (isExternal) return user.image;

  // Safe fallback for relative image path
  return `https://project-drop.onrender.com${user.image.startsWith('/') ? '' : '/'}${user.image}`;
};


  const items = [
    {
      icon: <VscMail size={18} />,
      label: 'Email',
      onClick: () => window.location.href = 'mailto:bandikar.v.vijay@gmail.com',
    },
    {
      icon: <VscLink size={18} />,
      label: 'LinkedIn',
      onClick: () => window.open('https://www.linkedin.com/in/b-v-vijaya-bhaskar-2a50592b4/', '_blank', 'noopener'),
    },
    {
      icon: <VscGlobe size={18} />,
      label: 'Profile',
      onClick: () => window.open('https://vijayabhaskar.vercel.app/', '_blank', 'noopener'),
    },
    {
      icon: <VscGithub size={18} />,
      label: 'GitHub',
      onClick: () => window.open('https://github.com/bandikarvijay', '_blank', 'noopener'),
    },
  ];

  return (
    <div className="main-page" style={{ position: 'relative', minHeight: '100vh' }}>
      <div
        className="dark-veil-wrap"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <DarkVeil />
      </div>

      <div className="main-content" style={{ position: 'relative', zIndex: 1 }}>
        <nav className="navbar" style={{ zIndex: 2 }}>
          <TrueFocus
            sentence="Project Drop"
            manualMode={false}
            blurAmount={5}
            borderColor="orange"
            textColor="orange"
            animationDuration={2}
            pauseBetweenAnimations={1}
          >
            <div className="logo">ProjectDrop</div>
          </TrueFocus>

          <div className="nav-icons" ref={dropdownRef}>
            {!user ? (
              <Link to="/auth" title="Login / Register">
                <img src="/profile.png" alt="Login" className="profile-icon" />
              </Link>
            ) : (
              <div className="profile-wrapper">
                <img
                  src={profileSrc()}
                  alt="Profile"
                  className="profile-icon"
                  onClick={() => setOpen((prev) => !prev)}
                  style={{ cursor: 'pointer' }}
                />
                {open && (
                  <div className="dropdown-menu">
                    <button onClick={handleLogout} className="dropdown-btn">Logout</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
{/* Heading above boxes */}
<div 
  style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: '8px', 
    marginBottom: '16px' 
  }}
>
  <img 
    src="/pd-logo.png" 
    alt="PD Logo" 
    style={{ width: '52px', height: '52px', objectFit: 'contain' }} 
  />
<h2 style={{ margin: 0, fontSize: '2.8rem' }}>
  <TextType
    text={["Project Drop...!"]}
    typingSpeed={75}
    pauseDuration={1500}
    showCursor={true}
    cursorCharacter="|"
  />
</h2>




</div>

<div className="boxes" style={{ zIndex: 1 }}>
  <div
    className="box"
    onClick={() => {
      if (!user) {
        localStorage.setItem('redirectTo', '/web');
        navigate('/auth');
      } else {
        navigate('/web');
      }
    }}
  >
    <img src="/web.png" alt="Web" />
    <p>Web Projects</p>
  </div>

  <div
    className="box"
    onClick={() => {
      if (!user) {
        localStorage.setItem('redirectTo', '/data');
        navigate('/auth');
      } else {
        navigate('/data');
      }
    }}
  >
    <img src="/data.png" alt="Data" />
    <p>Data Projects</p>
  </div>

  <div
    className="box"
    onClick={() => {
      if (!user) {
        localStorage.setItem('redirectTo', '/mobile');
        navigate('/auth');
      } else {
        navigate('/mobile');
      }
    }}
  >
    <img src="/mobile.png" alt="Mobile" />
    <p>Mobile Projects</p>
  </div>
</div>

      </div>

      <footer className="footer" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '8px 16px', textAlign: 'center' }}>
          <div className="dock-wrapper" style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <Dock
              items={items}
              panelHeight={60}    // slightly smaller
              baseItemSize={44}   // slightly smaller
              magnification={70}  // much gentler magnification
            />
          </div>

          <p style={{ color: '#a93e0b', margin: 0 }}>&copy; 2025 ProjectDrop</p>
        </div>
      </footer>
    </div>
  );
}

export default MainPage;
