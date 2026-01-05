import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="nav-logo">Care<span>Link</span></div>
          <p>Empowering NYC with accessible resources.</p>
        </div>
        
        <div className="footer-links">
          <div className="footer-column">
            <h4>Platform</h4>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/faq">FAQ</a>
          </div>
          <div className="footer-column">
            <h4>Resources</h4>
            <a href="/food">Food</a>
            <a href="/housing">Housing</a>
            <a href="/healthcare">Health</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 CareLink. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;