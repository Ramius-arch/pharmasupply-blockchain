import React, { useState, useEffect, useContext } from 'react';
import userService from '../../api/userService';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const UserManagement = () => {
  const { user: currentUser } = useContext(AuthContext);
  const token = currentUser?.token;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await userService.getAllUsers(token);
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch stakeholder records.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchUsers();
  }, [token]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userService.updateUserProfile(userId, { role: newRole }, token);
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      toast.success('System role updated on node.');
    } catch (err) {
      toast.error('Privilege escalation failed.');
    }
  };

  const handleDeactivate = async (userId) => {
    if (window.confirm('Revoke all access for this stakeholder?')) {
      try {
        await userService.updateUserProfile(userId, { isActive: false }, token);
        setUsers(users.map(u => u._id === userId ? { ...u, isActive: false } : u));
        toast.warning('Stakeholder access revoked.');
      } catch (err) {
        toast.error('Revocation failed.');
      }
    }
  };

  if (loading) return <div className="loading">Syncing Stakeholder Directory...</div>;

  return (
    <div className="user-management">
      <div className="admin-header">
        <h2>Stakeholder & User Management</h2>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Full Name</th>
              <th>Email Address</th>
              <th>System Role</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{user._id.slice(-8).toUpperCase()}</td>
                <td style={{ fontWeight: '500' }}>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>
                  <select 
                    value={user.role} 
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    style={{ background: 'transparent', color: 'inherit', border: '1px solid var(--border)', padding: '2px 4px', borderRadius: '4px' }}
                  >
                    <option value="user">Recipient</option>
                    <option value="supplier">Supplier</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <span className={`status-chip ${user.isActive !== false ? 'success' : 'danger'}`}>
                    {user.isActive !== false ? 'Active' : 'Revoked'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    className="btn btn-outline" 
                    style={{ padding: '4px 12px', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                    onClick={() => handleDeactivate(user._id)}
                    disabled={user._id === currentUser._id}
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
