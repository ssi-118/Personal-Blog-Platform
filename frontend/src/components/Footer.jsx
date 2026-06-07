import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      padding: '2.5rem 0',
      backgroundColor: 'var(--bg-secondary)',
      marginTop: 'auto',
    }}>
      <div className="container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
          Dev<span className="gradient-text">Canvas</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px' }}>
          Thoughts, guides, and projects on modern full-stack development, cloud architecture, and user experience.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
          &copy; {new Date().getFullYear()} DevCanvas. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
