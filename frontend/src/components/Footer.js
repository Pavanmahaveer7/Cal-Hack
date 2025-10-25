import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Braillience</h3>
            <p className="footer-description">
              Accessible flashcard learning for blind college students.
            </p>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">Features</h4>
            <ul className="footer-links">
              <li>Voice Navigation</li>
              <li>PDF Upload</li>
              <li>Flashcard Generation</li>
              <li>Learning Modes</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">Accessibility</h4>
            <ul className="footer-links">
              <li>Screen Reader Support</li>
              <li>Keyboard Navigation</li>
              <li>High Contrast Mode</li>
              <li>Voice Commands</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2024 Braillience. Built for accessibility and inclusion.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
