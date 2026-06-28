import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faPills,
  faShoppingCart,
  faBoxOpen,
  faLink,
  faKey,
  faShieldAlt,
  faSignInAlt,
  faUserPlus,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const location = useLocation();

  const handleLinkClick = () => {
    if (window.innerWidth <= 1024) {
      onClose();
    }
  };

  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard');

  const NavItem = ({ to, icon, label, end = false }) => (
    <li>
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        onClick={handleLinkClick}
      >
        <FontAwesomeIcon icon={icon} className="nav-icon" />
        <span>{label}</span>
      </NavLink>
    </li>
  );

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-flex">
          <div className="brand-lockup">
            <h1 className="logo">PharmaNet</h1>
            <div className="system-status">
              <span className="pulse" aria-hidden="true"></span>
              Active Node
            </div>
          </div>
          <button className="mobile-close" onClick={onClose} aria-label="Close sidebar">
            &times;
          </button>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        <div className="nav-group">
          <span className="group-label">General</span>
          <ul>
            <NavItem to="/" icon={faHome} label="Home" end />
            <NavItem to="/products" icon={faPills} label="Products" />
          </ul>
        </div>

        {isAuthenticated && (
          <div className="nav-group">
            <span className="group-label">Operations</span>
            <ul>
              <NavItem to="/cart" icon={faShoppingCart} label="Shipment Cart" />
              <NavItem to="/my-orders" icon={faBoxOpen} label="My Orders" />
              <NavItem to="/blockchain-transaction" icon={faLink} label="Ledger Log" />
              <NavItem to="/generate-wallet" icon={faKey} label="Node Key" />
            </ul>
          </div>
        )}

        {isAuthenticated && (user?.role === 'admin' || user?.role === 'supplier') && (
          <div className="nav-group">
            <span className="group-label">System Admin</span>
            <ul>
              <li>
                <NavLink
                  to="/admin"
                  className={({ isActive }) => `nav-link ${isActive || isAdminRoute ? 'active' : ''}`}
                  onClick={handleLinkClick}
                >
                  <FontAwesomeIcon icon={faShieldAlt} className="nav-icon" />
                  <span>Control Center</span>
                </NavLink>
              </li>
            </ul>
          </div>
        )}

        {!isAuthenticated && (
          <div className="nav-group">
            <span className="group-label">Gateway</span>
            <ul>
              <NavItem to="/login" icon={faSignInAlt} label="Authenticate" />
              <NavItem to="/register" icon={faUserPlus} label="Register Node" />
            </ul>
          </div>
        )}
      </nav>

      <div className="sidebar-footer">
        {isAuthenticated ? (
          <div className="user-token">
            <div className="user-meta">
              <div className="user-name">{user?.firstName} {user?.lastName}</div>
              <div className="user-role">{user?.role?.toUpperCase()}</div>
            </div>
            <button
              onClick={() => { logout(); handleLinkClick(); }}
              className="btn btn-outline logout-btn"
              aria-label="Sign out"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span>Exit Session</span>
            </button>
          </div>
        ) : (
          <div className="guest-mode">
            <FontAwesomeIcon icon={faSignInAlt} className="guest-icon" />
            Guest Mode
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
