// src/components/AuthPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthPage.css';
import Orb from './Orb/Orb'; // adjust path if needed

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsLogin(prev => !prev);
    setImage(null);
    setFormData({ email: '', password: '', username: '' });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await axios.post('http://localhost:5000/api/auth/login', {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userInfo', JSON.stringify(res.data.user));
        navigate('/');
      } else {
        const data = new FormData();
        data.append('username', formData.username);
        data.append('email', formData.email);
        data.append('password', formData.password);
        if (image) data.append('image', image);

        const res = await axios.post('http://localhost:5000/api/auth/register', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userInfo', JSON.stringify(res.data.user));
        navigate('/');
      }
    } catch (err) {
      console.error('Auth error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="authpage-root">
      {/* FULL-SCREEN ORB BACKGROUND */}
      <div
        className="orb-fullscreen"
        aria-hidden="true"
        // pointerEvents none ensures the Orb doesn't block clicks to the form
        style={{ pointerEvents: 'none' }}
      >
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
          // pass any other props your Orb supports
        />
      </div>

      {/* main content (form) sits above the Orb */}
      <div className="authpage-content">
        <div className="auth-container">
          <h2>{isLogin ? 'Login' : 'Register'}</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit" className="auth-btn">{isLogin ? 'Login' : 'Register'}</button>
          </form>

          <p onClick={handleToggle} className="toggle">
            {isLogin ? "Don't have an account? Register here" : 'Already have an account? Login here'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
