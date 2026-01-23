// src/components/AdminDashboard/UserManagement.jsx
import React from 'react';
import './AdminDashboard.css';

const UserManagement = () => {
  return (
    <div className="card">
      <h3>User Management</h3>
      {/* Add user table with actions here */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Placeholder data - replace with actual API calls */}
          <tr>
            <td>1</td>
            <td>John Doe</td>
            <td>john.doe@example.com</td>
            <td>Customer</td>
            <td>
              <button className="edit-btn">Edit</button>
              <button className="delete-btn">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
