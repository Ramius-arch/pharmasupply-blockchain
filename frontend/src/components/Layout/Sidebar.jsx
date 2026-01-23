import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, isAuthenticated } = useContext(AuthContext);

  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/cart">Cart</Link>
              </li>
              <li>
                <Link to="/my-orders">My Orders</Link>
              </li>
              <li>
                <Link to="/blockchain-transaction">Transactions</Link>
              </li>
              <li>
                <Link to="/generate-wallet">Generate Wallet</Link>
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              {(user?.role === 'admin' || user?.role === 'supplier') && (
                <li>
                  <Link to="/admin">Admin Dashboard</Link>
                </li>
              )}
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

