const handleSuccess = async (credentialResponse) => {
  try {
    const decoded = jwtDecode(credentialResponse.credential);
    const res = await axios.post('https://your-backend-url/api/auth/google-login', {
      name: decoded.name,
      email: decoded.email,
      googleId: decoded.sub,
    });

    localStorage.setItem('token', res.data.token);
    navigate(location.state?.redirectTo || '/');
  } catch (err) {
    console.error('Google login error:', err);
    alert('Login failed: Server error');
  }
};
