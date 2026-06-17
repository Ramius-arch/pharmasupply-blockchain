import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import DashboardOverview from './DashboardOverview';
import ProductManagement from './ProductManagement';
import AdminOrders from './AdminOrders';
import UserManagement from './UserManagement';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  const totalOrders = 1234;
  const revenue = 567890;
  const usersCount = 12345;

  return (
    <div className="admin-dashboard container animate-fade-in">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Control Center</h1>
        <div className="admin-actions hidden-mobile">
          <button className="btn btn-primary">Create Product</button>
          <button className="btn btn-outline">Add User</button>
        </div>
      </div>

      <div className="dashboard-content">
        <DashboardOverview totalOrders={totalOrders} revenue={revenue} users={usersCount} />

        <div className="admin-section card">
          <ProductManagement />
        </div>

        <div className="admin-section card">
          <AdminOrders />
        </div>

        <div className="admin-section card">
          <UserManagement />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
