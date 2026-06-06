import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUserCircle, faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header = ({ onToggleSidebar }) => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="hamburger-btn" onClick={onToggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div className="header-logo desktop-only">
          <Link to="/">PharmaNet Ledger</Link>
        </div>
      </div>

      <div className="header-right">
        <div className="header-actions">
          <button className="action-icon" title="Notifications">
            <FontAwesomeIcon icon={faBell} />
            <span className="notification-dot"></span>
          </button>
          
          {isAuthenticated ? (
            <div className="user-profile-menu">
              <Link to="/profile" className="profile-trigger">
                <FontAwesomeIcon icon={faUserCircle} />
                <span className="user-name-small">{user.firstName}</span>
              </Link>
              <button onClick={logout} className="logout-btn-header" title="Exit Session">
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-link-header">Authenticate</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
