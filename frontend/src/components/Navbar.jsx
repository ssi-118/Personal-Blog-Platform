import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, LayoutDashboard, BookOpen, PenTool } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderRadius: '0 0 16px 16px',
      borderTop: 'none',
      padding: '1rem 0'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="animate-float" style={{ fontSize: '1.75rem' }}>✍️</span>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Dev<span className="gradient-text">Canvas</span>
          </h1>
        </Link>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" className="btn btn-secondary btn-small" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <BookOpen size={16} />
            <span>Blog</span>
          </Link>

          {user ? (
            <>
              <Link to="/admin" className="btn btn-secondary btn-small" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>
              <Link to="/admin/write" className="btn btn-primary btn-small" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <PenTool size={16} />
                <span>Write</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary btn-small" title="Logout" style={{ padding: '0.5rem' }}>
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-secondary btn-small">
              Admin Login
            </Link>
          )}

          {/* Theme Toggler */}
          <button 
            onClick={toggleTheme} 
            className="btn btn-secondary btn-small" 
            style={{ padding: '0.5rem', borderRadius: '50%' }}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
