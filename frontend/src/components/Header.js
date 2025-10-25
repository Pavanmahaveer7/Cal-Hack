import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import './Header.css';

function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Don't show header on login page
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <header className="header" role="banner">
      <div className="container">
        <div className="header-content">
          <Link to="/dashboard" className="logo" onClick={closeMenu}>
            <h1>Braillience</h1>
            <span className="logo-subtitle">Accessible Learning</span>
          </Link>

          <nav className="nav" role="navigation" aria-label="Main navigation">
            <button
              className="menu-toggle"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-controls="main-menu"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>

            <div 
              id="main-menu"
              className={`nav-menu ${isMenuOpen ? 'open' : ''}`}
              role="menu"
            >
              <Link
                to="/dashboard"
                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                onClick={closeMenu}
                role="menuitem"
              >
                Dashboard
              </Link>
              <Link
                to="/learn"
                className={`nav-link ${location.pathname === '/learn' ? 'active' : ''}`}
                onClick={closeMenu}
                role="menuitem"
              >
                Learn
              </Link>
              <Link
                to="/test"
                className={`nav-link ${location.pathname === '/test' ? 'active' : ''}`}
                onClick={closeMenu}
                role="menuitem"
              >
                Test Yourself
              </Link>
            </div>
          </nav>

          <div className="user-menu">
            <div className="user-info">
              <span className="user-name" aria-label={`Logged in as ${user?.name}`}>
                {user?.name}
              </span>
            </div>
            
            <div className="user-actions">
              <button
                className="user-menu-toggle"
                onClick={toggleMenu}
                aria-expanded={isMenuOpen}
                aria-label="User menu"
              >
                <FiUser />
              </button>
              
              <div className={`user-dropdown ${isMenuOpen ? 'open' : ''}`}>
                <button
                  className="dropdown-item"
                  onClick={closeMenu}
                  aria-label="Settings"
                >
                  <FiSettings />
                  Settings
                </button>
                <button
                  className="dropdown-item logout"
                  onClick={handleLogout}
                  aria-label="Sign out"
                >
                  <FiLogOut />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
