import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const res = await axios.post('https://noble-transformation-production-ba33.up.railway.app/api/auth/google-login', {
        name: decoded.name,
        email: decoded.email,
        googleId: decoded.sub,
      });

      localStorage.setItem('token', res.data.token);
      alert('Login successful!');
      navigate(location.state?.redirectTo || '/');
    } catch (err) {
      console.error('Google login error:', err);
      alert('Login failed: Server error');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px', color: '#a93e0b' }}>
      <h2>Login with Google</h2>
      <div style={{ display: 'inline-block', transform: 'scale(0.85)' }}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => alert('Google Login Failed')}
        />
      </div>
    </div>
  );
}

export default Login;
