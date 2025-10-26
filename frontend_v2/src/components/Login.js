import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        toast.success('Login successful!');
        navigate('/');
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const result = await demoLogin();
      if (result.success) {
        toast.success('Demo login successful!');
        navigate('/');
      } else {
        toast.error(result.error || 'Demo login failed');
      }
    } catch (error) {
      console.error('Demo login error:', error);
      toast.error('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome to Braillience</h1>
        <p className="login-subtitle">Accessible flashcard learning for blind college students</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
              aria-describedby="email-help"
            />
            <small id="email-help" className="form-help">
              Enter your email address
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              aria-describedby="password-help"
            />
            <small id="password-help" className="form-help">
              Enter your password
            </small>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-button"
            aria-describedby="login-help"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          <small id="login-help" className="form-help">
            Use any email and password for demo
          </small>
        </form>

        <div className="demo-section">
          <p className="demo-text">For demo purposes:</p>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="demo-button"
          >
            Use Demo Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
