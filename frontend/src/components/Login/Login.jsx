import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await login(email, password);
      navigate('/');
      toast.success('Access Granted - Session Initialized');
    } catch (error) {
      toast.error(error.message || 'Authentication failed');
    }
  };

  return (
    <div className="login-container container animate-fade-in">
      <div className="login-card card">
        <div className="login-header">
          <h1 className="logo" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>PharmaSupply</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Secure Node Authentication</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-row">
            <label htmlFor="email">Node ID (Email)</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@pharma.net"
              required
            />
          </div>
          <div className="input-row">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label htmlFor="password">Security Key (Password)</label>
              <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>Recover Key?</Link>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '48px', marginTop: '16px' }} disabled={loading}>
            {loading ? 'Verifying Credentials...' : 'Authenticate'}
          </button>
        </form>

        <div className="login-footer" style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            New node cluster? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Register Station</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
