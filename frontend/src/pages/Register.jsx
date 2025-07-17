import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
      setSuccess('Registration successful! You can now log in.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <form onSubmit={handleSubmit} style={{
        background: 'var(--surface)',
        padding: '2.5rem 2rem',
        borderRadius: '18px',
        boxShadow: '0 4px 24px rgba(255,184,107,0.08)',
        minWidth: 320,
        maxWidth: 360,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
      }}>
        <h2 style={{ color: 'var(--secondary)', margin: 0, fontWeight: 700, fontSize: '2rem', textAlign: 'center' }}>Sign Up</h2>
        {error && <div style={{ color: 'var(--error)', textAlign: 'center', fontWeight: 500 }}>{error}</div>}
        {success && <div style={{ color: 'var(--accent)', textAlign: 'center', fontWeight: 500 }}>{success}</div>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" style={{ fontWeight: 600, fontSize: '1.1em', background: 'var(--secondary)', color: 'var(--text)' }}>Register</button>
        <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign In</Link>
        </div>
      </form>
    </div>
  );
}

export default Register; 