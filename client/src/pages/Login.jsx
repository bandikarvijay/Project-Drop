const handleSuccess = async (credentialResponse) => {
  try {
    const decoded = jwtDecode(credentialResponse.credential);
    const res = await axios.post('https://project-drop-backend.onrender.com/api/auth/google-login', {
      name: decoded.name,
      email: decoded.email,
      googleId: decoded.sub,
    });

    localStorage.setItem('token', res.data.token);
    // alert('Login successful!'); ← ❌ REMOVE or comment this line
    navigate(location.state?.redirectTo || '/');
  } catch (err) {
    console.error('Google login error:', err);
    alert('Login failed: Server error');
  }
};
