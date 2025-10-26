import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
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
        navigate('/dashboard');
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
        navigate('/dashboard');
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
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">
            <FiUser className="title-icon" />
            Professor Login
          </h1>
          <p className="login-subtitle">
            Sign in to manage your course materials and track student progress
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <FiMail className="label-icon" />
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
              placeholder="Enter your email"
              aria-describedby="email-help"
            />
            <small id="email-help" className="form-help">
              Use your institutional email address
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <FiLock className="label-icon" />
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              placeholder="Enter your password"
              aria-describedby="password-help"
            />
            <small id="password-help" className="form-help">
              Enter your account password
            </small>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-button"
            aria-describedby="login-help"
          >
            {loading ? 'Signing In...' : 'Sign In to Dashboard'}
            <FiArrowRight className="button-icon" />
          </button>
          <small id="login-help" className="form-help">
            Access your professor dashboard and course materials
          </small>
        </form>

        <div className="demo-section">
          <p className="demo-text">Quick access for testing:</p>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="demo-button"
          >
            Use Demo Professor Account
          </button>
        </div>

        <div className="login-footer">
          <p className="register-link-text">
            New to Braillience?{' '}
            <Link to="/register" className="register-link">
              Create Professor Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
