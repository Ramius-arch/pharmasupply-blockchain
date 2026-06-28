import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSignOutAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header = ({ onToggleSidebar }) => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="hamburger-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation sidebar"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div className="header-logo">
          <Link to="/" aria-label="Go to home">
            <span className="logo-full">PharmaNet Ledger</span>
            <span className="logo-short">PharmaNet</span>
          </Link>
        </div>
      </div>

      <div className="header-right">
        {isAuthenticated ? (
          <div className="user-profile-menu">
            <div className="profile-trigger" aria-label="Current user">
              <FontAwesomeIcon icon={faUserCircle} />
              <span className="user-name-small">{user?.firstName || 'User'}</span>
            </div>
            <button
              onClick={logout}
              className="logout-btn-header"
              title="Exit Session"
              aria-label="Sign out"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span className="logout-label">Exit</span>
            </button>
          </div>
        ) : (
          <Link to="/login" className="login-link-header">Authenticate</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
