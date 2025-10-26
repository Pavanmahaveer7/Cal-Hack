import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-container">
                <div className="header-brand">
                  <Link to="/" className="brand-link" aria-label="Braillience Home">
                    <div className="brand-logo">
                      <div className="logo-container">
                        <div className="brain-icon">🧠</div>
                      </div>
                      <div className="brand-text">
                        <h1 className="brand-title">Braillience</h1>
                        <span className="brand-subtitle">AI-Powered Learning</span>
                      </div>
                    </div>
                  </Link>
                </div>

        <nav className="header-nav" role="navigation" aria-label="Main navigation">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">
                About
              </Link>
            </li>
            {user && (
              <>
                <li className="nav-item">
                  <Link to="/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/upload" className="nav-link">
                    Upload
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/voice" className="nav-link">
                    Voice
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <div className="header-actions">
          {user ? (
            <div className="user-info">
              <span className="user-name">Welcome, {user.name}</span>
              <button
                onClick={logout}
                className="logout-button"
                aria-label="Sign out">
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-link">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
