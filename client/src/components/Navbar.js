import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={handleLinkClick}>
          <span className="logo-icon">⚡</span>
          <span className="logo-text">DevMatch</span>
        </Link>

        <button
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          id="hamburger-toggle"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <div className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                onClick={handleLinkClick}
                id="nav-match"
              >
                <span className="nav-icon">🎯</span>
                Match
              </Link>
              <Link
                to="/discover"
                className={`nav-link ${isActive('/discover') ? 'active' : ''}`}
                onClick={handleLinkClick}
                id="nav-discover"
              >
                <span className="nav-icon">🔍</span>
                Discover
              </Link>
              <Link
                to="/messages"
                className={`nav-link ${isActive('/messages') ? 'active' : ''}`}
                onClick={handleLinkClick}
                id="nav-messages"
              >
                <span className="nav-icon">💬</span>
                Messages
              </Link>
              <Link
                to="/profile"
                className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                onClick={handleLinkClick}
                id="nav-profile"
              >
                <span className="nav-icon">👤</span>
                Profile
              </Link>
              <button onClick={handleLogout} className="nav-logout" id="nav-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                onClick={handleLinkClick}
                id="nav-login"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="nav-link register-link"
                onClick={handleLinkClick}
                id="nav-register"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;