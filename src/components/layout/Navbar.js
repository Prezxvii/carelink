// src/components/layout/Navbar.jsx (or wherever your Navbar is)
import React, { useState, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, Heart, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const getInitials = (user) => {
  if (!user) return 'U';
  if (user.initials) return String(user.initials).slice(0, 2).toUpperCase();

  const first = user.firstName?.trim()?.[0];
  const last = user.lastName?.trim()?.[0];
  if (first || last) return `${first || ''}${last || ''}`.toUpperCase();

  const name = user.name?.trim() || '';
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  if (parts.length === 1) return `${parts[0][0]}`.toUpperCase();

  return 'U';
};

const Navbar = () => {
  const [dropdownActive, setDropdownActive] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const timeoutRef = useRef(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = useMemo(() => getInitials(user), [user]);

  const clearTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleMouseEnter = () => {
    clearTimer();
    setProfileDropdown(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setProfileDropdown(false), 150);
  };

  const handleNavigation = (path) => {
    setDropdownActive(false);
    setProfileDropdown(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    setProfileDropdown(false);
    navigate('/');
  };

  return (
    <header className="header-container">
      <nav className="navbar">
        <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }}>
          Care<span>Link</span>
        </Link>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>

          <li
            className="dropdown-wrapper"
            onMouseEnter={() => setDropdownActive(true)}
            onMouseLeave={() => setDropdownActive(false)}
          >
            <button className="dropdown-trigger" onClick={() => handleNavigation('/resources')}>
              Resources <ChevronDown size={14} className={`arrow ${dropdownActive ? 'rotate' : ''}`} />
            </button>

            {dropdownActive && (
              <div className="dropdown-menu">
                <div className="dropdown-menu-content">
                  <Link to="/resources?category=Food">Food Assistance</Link>
                  <Link to="/resources?category=Housing">Housing Support</Link>
                  <Link to="/resources?category=Healthcare">Healthcare</Link>
                  <Link to="/resources?category=Legal">Legal Aid</Link>
                  <Link to="/resources?category=Education">Education & Training</Link>
                  <hr className="dropdown-divider" />
                  <Link to="/resources" className="view-all-link">View All Resources</Link>
                </div>
              </div>
            )}
          </li>

          <li><Link to="/community">Community</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
        </ul>

        <div className="nav-auth">
          {user ? (
            <div
              className="user-profile-menu"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="profile-trigger" type="button">
                <div className="avatar-circle">{initials}</div>
                <span className="user-name-text">Hi, {user.firstName || user.name || 'Member'}</span>
                <ChevronDown size={14} />
              </button>

              {profileDropdown && (
                <div className="profile-dropdown-menu">
                  <div className="profile-header">
                    <p className="profile-full-name">
                      {(user.firstName || user.name || 'Member')}{user.lastName ? ` ${user.lastName}` : ''}
                    </p>
                    <p className="profile-meta">{user.location || 'NYC Member'}</p>
                  </div>
                  <hr />

                  <Link
                    to="/profile"
                    className="dropdown-item-link"
                    onClick={() => setProfileDropdown(false)}
                  >
                    <User size={16} /> My Profile
                  </Link>

                  <Link
                    to="/favorites"
                    className="dropdown-item-link"
                    onClick={() => setProfileDropdown(false)}
                  >
                    <Heart size={16} /> Saved Resources
                  </Link>

                  <Link
                    to="/settings"
                    className="dropdown-item-link"
                    onClick={() => setProfileDropdown(false)}
                  >
                    <Settings size={16} /> Settings
                  </Link>

                  <hr />
                  <button onClick={handleLogout} className="logout-btn" type="button">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="btn-login-round" onClick={() => handleNavigation('/login')}>Login</button>
              <button className="btn-signup-round" onClick={() => handleNavigation('/signup')}>Sign Up</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
