// src/components/AdminDashboard/DashboardOverview.jsx
import React from 'react';
import './AdminDashboard.css';

const DashboardOverview = ({ totalOrders, revenue, users }) => {
  return (
    <div className="card">
      <h3>Dashboard Overview</h3>
      <div className="metrics-container">
        <div className="metric">
          <h4>Total Orders</h4>
          <p>{totalOrders}</p>
        </div>
        <div className="metric">
          <h4>Revenue</h4>
          <p>${(revenue / 100).toFixed(2)}</p>
        </div>
        <div className="metric">
          <h4>Users</h4>
          <p>{users}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
