import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminOrders = () => {
    const { user } = useContext(AuthContext);
    const token = user?.token;
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAllOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/orders');
            setOrders(response.data.data);
        } catch (err) {
            setError('Failed to fetch orders. Make sure the backend is running.');
            console.error('Error fetching all orders:', err);
            toast.error('Failed to fetch orders.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(`/api/orders/${orderId}/status`, { status: newStatus });
            toast.success(`Order ${orderId} status updated to ${newStatus}`);
            fetchAllOrders(); // Refresh orders list
        } catch (err) {
            console.error(`Error updating order ${orderId} status to ${newStatus}:`, err);
            toast.error(`Failed to update order ${orderId} status.`);
        }
    };

    if (loading) {
        return <div className="loading">Loading orders...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!orders.length) {
        return <div className="no-data">No orders found.</div>;
    }

    return (
        <div className="order-management">
            <div className="admin-header">
                <h2>Shipment & Order Management</h2>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Shipment ID</th>
                            <th>Destination / Customer</th>
                            <th>Value</th>
                            <th>Current Status</th>
                            <th>Manifest</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{order._id.slice(-8).toUpperCase()}</td>
                                <td style={{ fontWeight: '500' }}>
                                    {order.user.firstName} {order.user.lastName}
                                </td>
                                <td>${order.totalAmount.toFixed(2)}</td>
                                <td>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        className="btn btn-outline"
                                        style={{
                                            padding: '4px 8px',
                                            fontSize: '0.8rem',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid var(--border)',
                                            color: 'var(--text-primary)'
                                        }}
                                    >
                                        <option value="pending">Pending Review</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">In Transit</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        {order.items.length} units ({order.items[0]?.product?.name.slice(0, 15)}...)
                                    </div>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <button 
                                        className="btn btn-outline" 
                                        style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                                        onClick={() => navigate('/blockchain-transaction')}
                                    >
                                        View Log
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

export default AdminOrders;