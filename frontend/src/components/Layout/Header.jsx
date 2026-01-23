import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext'; // Import useTheme
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme(); // Use the theme context

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">PharmaSupply Chain</Link>
        <nav className="nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/products" className="nav-link">Products</Link>
            </li>
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link to="/cart" className="nav-link">Cart</Link>
                </li>
                <li className="nav-item">
                  <Link to="/my-orders" className="nav-link">My Orders</Link>
                </li>
                <li className="nav-item">
                  <Link to="/blockchain-transaction" className="nav-link">Transactions</Link>
                </li>
                {(user?.role === 'admin' || user?.role === 'supplier') && (
                  <li className="nav-item">
                    <Link to="/admin" className="nav-link">Dashboard</Link>
                  </li>
                )}
                <li className="nav-item">
                  <button onClick={logout} className="nav-link logout-btn">Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">Register</Link>
                </li>
              </>
            )}
            <li className="nav-item theme-toggle"> {/* Added theme toggle */}
              <button onClick={toggleTheme} className="nav-link">
                {theme === 'light' ? 'Dark Mode' : theme === 'dark' ? 'Navy Mode' : 'Light Mode'}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;