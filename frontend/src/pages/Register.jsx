import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await register(email, password);
      setSuccess('Registration successful! Please check your email(***Especially Spam***) to verify your account before logging in.');
    } catch (err) {
      let msg = 'Registration failed';
      if (err.code === 'auth/email-already-in-use') msg = 'This email is already registered.';
      else if (err.code === 'auth/invalid-email') msg = 'Please enter a valid email address.';
      else if (err.code === 'auth/weak-password') msg = 'Password should be at least 6 characters.';
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
        <button type="submit" style={{ fontWeight: 600, fontSize: '1.1em', background: 'var(--secondary)', color: 'var(--text)' }} disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign In</Link>
        </div>
      </form>
    </div>
  );
}

export default Register; 