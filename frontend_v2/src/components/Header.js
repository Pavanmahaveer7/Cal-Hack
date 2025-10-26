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
          <Link to="/" className="brand-link">
            <h1 className="brand-title">Braillience</h1>
            <span className="brand-subtitle">Accessible Learning</span>
          </Link>
        </div>

        {user && (
          <nav className="header-nav" role="navigation" aria-label="Main navigation">
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/learn" className="nav-link">
                  Learn
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/test" className="nav-link">
                  Test
                </Link>
              </li>
            </ul>
          </nav>
        )}

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
