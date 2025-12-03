// src/components/Login.js

import React, { useState } from 'react';
import './Login.css';
import { getOrCreateUser } from '../utils/scoreManager';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = username.trim();

    if (!trimmed) {
      setError('Please enter a username.');
      return;
    }

    if (trimmed.length > 20) {
      setError('Username must be 20 characters or less.');
      return;
    }

    setError('');
    setLoading(true);

    // Fake small delay for nicer UX
    setTimeout(() => {
      const user = getOrCreateUser(trimmed);
      setLoading(false);
      onLogin(user);
    }, 400);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">🎨 Drag to Style</h1>
        <p className="login-subtitle">Drop the Design, Drop the Code!</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-label">
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter a username"
              disabled={loading}
              className="login-input"
            />
          </label>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in…' : 'Start Designing'}
          </button>
        </form>

        <p className="login-hint">
          Your username and scores are stored only on this device.
        </p>
      </div>
    </div>
  );
}

export default Login;
