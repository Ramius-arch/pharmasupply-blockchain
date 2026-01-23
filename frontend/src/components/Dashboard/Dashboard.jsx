import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user?.name || 'User'}!</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Account Status</h2>
          <p>Your account is active.</p>
        </div>
        <div className="dashboard-card">
          <h2>Recent Transactions</h2>
          <p>You have no recent transactions.</p>
        </div>
        <div className="dashboard-card">
          <h2>Upcoming Due Dates</h2>
          <p>You have no upcoming due dates.</p>
        </div>
        <div className="dashboard-card">
          <h2>Quick Actions</h2>
          <ul>
            <li><a href="/products">View Products</a></li>
            <li><a href="/cart">View Cart</a></li>
            <li><a href="/my-orders">View My Orders</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
