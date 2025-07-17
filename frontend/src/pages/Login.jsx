import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/chat');
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <form onSubmit={handleSubmit} style={{
        background: 'var(--surface)',
        padding: '2.5rem 2rem',
        borderRadius: '18px',
        boxShadow: '0 4px 24px rgba(162,89,247,0.08)',
        minWidth: 320,
        maxWidth: 360,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
      }}>
        <h2 style={{ color: 'var(--primary)', margin: 0, fontWeight: 700, fontSize: '2rem', textAlign: 'center' }}>Sign In</h2>
        {error && <div style={{ color: 'var(--error)', textAlign: 'center', fontWeight: 500 }}>{error}</div>}
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
        <button type="submit" style={{ fontWeight: 600, fontSize: '1.1em' }}>Login</button>
        <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--secondary)', fontWeight: 600 }}>Sign Up</Link>
        </div>
      </form>
    </div>
  );
}

export default Login; 