import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  const handleLinkClick = () => {
    if (window.innerWidth <= 1024) {
      onClose();
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-flex">
          <h1 className="logo">PharmaNet</h1>
          <button className="mobile-close" onClick={onClose}>&times;</button>
        </div>
        <div className="system-status">
          <span className="pulse"></span> Active Node
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group">
          <span className="group-label">General</span>
          <ul>
            <li><Link to="/" className="nav-link" onClick={handleLinkClick}>🏠 Home</Link></li>
            <li><Link to="/products" className="nav-link" onClick={handleLinkClick}>💊 Products</Link></li>
          </ul>
        </div>

        {isAuthenticated && (
          <div className="nav-group">
            <span className="group-label">Operations</span>
            <ul>
              <li><Link to="/cart" className="nav-link" onClick={handleLinkClick}>🛒 Shipment Cart</Link></li>
              <li><Link to="/my-orders" className="nav-link" onClick={handleLinkClick}>📦 My Orders</Link></li>
              <li><Link to="/blockchain-transaction" className="nav-link" onClick={handleLinkClick}>⛓️ Ledger Log</Link></li>
              <li><Link to="/generate-wallet" className="nav-link" onClick={handleLinkClick}>🔑 Node Key</Link></li>
            </ul>
          </div>
        )}

        {isAuthenticated && (user?.role === 'admin' || user?.role === 'supplier') && (
          <div className="nav-group">
            <span className="group-label">System Admin</span>
            <ul>
              <li><Link to="/admin" className="nav-link" onClick={handleLinkClick}>🛡️ Control Center</Link></li>
            </ul>
          </div>
        )}

        {!isAuthenticated && (
          <div className="nav-group">
            <span className="group-label">Gateway</span>
            <ul>
              <li><Link to="/login" className="nav-link" onClick={handleLinkClick}>🔐 Authenticate</Link></li>
              <li><Link to="/register" className="nav-link" onClick={handleLinkClick}>📝 Register Node</Link></li>
            </ul>
          </div>
        )}
      </nav>

      <div className="sidebar-footer">
        {isAuthenticated ? (
          <div className="user-token">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div className="user-name">{user.firstName} {user.lastName}</div>
                <div className="user-role">{user.role.toUpperCase()}</div>
              </div>
              <button
                onClick={() => { logout(); handleLinkClick(); }}
                className="btn btn-outline"
                style={{ width: '100%', padding: '8px', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
              >
                Exit Session
              </button>
            </div>
          </div>
        ) : (
          <div className="guest-mode">Guest Mode</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

