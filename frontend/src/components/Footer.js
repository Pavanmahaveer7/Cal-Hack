import React from 'react';
import { FiHeart, FiGithub, FiMail, FiGlobe } from 'react-icons/fi';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Braillience</h3>
            <p className="footer-description">
              Making language learning accessible to everyone, one lesson at a time.
            </p>
            <div className="footer-links">
              <a href="https://github.com" className="footer-link" aria-label="GitHub">
                <FiGithub />
              </a>
              <a href="mailto:contact@braillience.com" className="footer-link" aria-label="Email">
                <FiMail />
              </a>
              <a href="https://braillience.com" className="footer-link" aria-label="Website">
                <FiGlobe />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Features</h4>
            <ul className="footer-list">
              <li><a href="/learn" className="footer-link">Learn</a></li>
              <li><a href="/test" className="footer-link">Test Yourself</a></li>
              <li><a href="/progress" className="footer-link">Progress Tracking</a></li>
              <li><a href="/accessibility" className="footer-link">Accessibility</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-list">
              <li><a href="/help" className="footer-link">Help Center</a></li>
              <li><a href="/contact" className="footer-link">Contact Us</a></li>
              <li><a href="/feedback" className="footer-link">Feedback</a></li>
              <li><a href="/bug-report" className="footer-link">Report Bug</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Accessibility</h4>
            <ul className="footer-list">
              <li><a href="/screen-reader" className="footer-link">Screen Reader Guide</a></li>
              <li><a href="/keyboard-nav" className="footer-link">Keyboard Navigation</a></li>
              <li><a href="/audio-settings" className="footer-link">Audio Settings</a></li>
              <li><a href="/high-contrast" className="footer-link">High Contrast Mode</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © 2024 Braillience. Made with <FiHeart className="heart-icon" /> for accessibility.
            </p>
            <div className="footer-legal">
              <a href="/privacy" className="footer-legal-link">Privacy Policy</a>
              <a href="/terms" className="footer-legal-link">Terms of Service</a>
              <a href="/accessibility-statement" className="footer-legal-link">Accessibility Statement</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
