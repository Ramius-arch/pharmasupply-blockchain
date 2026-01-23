// src/components/AdminDashboard/AdminDashboard.jsx
import React, { useContext } from 'react';
import DashboardOverview from './DashboardOverview';
import ProductManagement from './ProductManagement';
// import AdminOrders from './AdminOrders'; // Temporarily commented out
import UserManagement from './UserManagement';
import { AuthContext } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  // Placeholder data - replace with actual API calls
  const totalOrders = 1234;
  const revenue = 567890;
  const users = 12345;

  return (
    <div className="admin-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="dashboard-title">Admin Dashboard</div>
        <div className="admin-actions">
          {user && user.role === 'admin' ? (
            <>
              <button>Create Product</button>
              <button>Add User</button>
            </>
          ) : null}
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        <DashboardOverview totalOrders={totalOrders} revenue={revenue} users={users} />
        <ProductManagement />
        {/* <AdminOrders /> */}
        <UserManagement />
      </div>
    </div>
  );
};

export default AdminDashboard;
