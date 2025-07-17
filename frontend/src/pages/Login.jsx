import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const cred = await login(email, password);
      await cred.user.reload(); // Ensure latest emailVerified status
      if (!cred.user.emailVerified) {
        setError('Please verify your email before logging in.');
        return;
      }
      navigate('/chat');
    } catch (err) {
      let msg = 'Login failed';
      if (err.code === 'auth/user-not-found') msg = 'No account found with this email.';
      else if (err.code === 'auth/wrong-password') msg = 'Incorrect password.';
      else if (err.code === 'auth/too-many-requests') msg = 'Too many failed attempts. Please try again later.';
      else if (err.code === 'auth/network-request-failed') msg = 'Network error. Please check your connection.';
      setError(msg);
    } finally {
      setLoading(false);
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
        <button type="submit" style={{ fontWeight: 600, fontSize: '1.1em', background: 'var(--primary)', color: 'var(--text)' }} disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
          Don&apos;t have an account?{' '}
          <Link to="/register" style={{ color: 'var(--secondary)', fontWeight: 600 }}>Sign Up</Link>
        </div>
      </form>
    </div>
  );
}

export default Login; 