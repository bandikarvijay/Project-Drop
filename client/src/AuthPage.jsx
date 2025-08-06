import React, { useState } from 'react';
import './AuthPage.css';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="auth-container">
      <div className={`form-container ${isLogin ? '' : 'register-mode'}`}>
        <div className="form-box login">
          <h2>Login</h2>
          <form>
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Login</button>
            <p onClick={toggleForm}>Don't have an account? <span>Register</span></p>
          </form>
        </div>

        <div className="form-box register">
          <h2>Register</h2>
          <form>
            <input type="text" placeholder="Name" required />
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Register</button>
            <p onClick={toggleForm}>Already have an account? <span>Login</span></p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
