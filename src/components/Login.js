import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (username.trim() === '') {
      setError('Please enter a username');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    // CHECK FOR DUPLICATE USERNAME
    const lastUser = localStorage.getItem('dragToStyleUser');
    if (lastUser) {
      try {
        const lastUserData = JSON.parse(lastUser);
        if (lastUserData.username.toLowerCase() === username.trim().toLowerCase()) {
          setError('⚠️ This username was used in the last session. Please choose a different username!');
          return;
        }
      } catch (e) {
        console.error('Error parsing last user:', e);
      }
    }

    // Show loading animation
    setLoading(true);
    setError('');

    // Simulate loading delay (you can remove setTimeout if you want instant login)
    setTimeout(() => {
      // Create user object
      const userData = {
        id: Date.now(),
        username: username.trim(),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      // Store in localStorage
      localStorage.setItem('dragToStyleUser', JSON.stringify(userData));
      
      // Also store in users list
      const users = JSON.parse(localStorage.getItem('dragToStyleUsers') || '[]');
      const existingUser = users.find(u => u.username.toLowerCase() === userData.username.toLowerCase());
      
      if (!existingUser) {
        users.push(userData);
        localStorage.setItem('dragToStyleUsers', JSON.stringify(users));
      }

      onLogin(userData);
      setLoading(false);
    }, 1500); // 1.5 second loading animation
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-box">
          <div className="login-icon">🎨</div>
          <h1>Drag to Style</h1>
          <p className="tagline">Drop the Design, Drop the Code!</p>
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoFocus
                disabled={loading}
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" disabled={loading} className="login-btn">
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner"></span>
                  Logging in...
                </span>
              ) : (
                '🚀 Start Playing'
              )}
            </button>
          </form>
          
          <p className="info-text">
            New here? Just enter a username to get started!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
