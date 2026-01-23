import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import './AdminDashboard.css'; // Corrected CSS file for this component

const AdminOrders = () => {
    const { user } = useContext(AuthContext);
    const token = user?.token;

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAllOrders = async () => {
        if (!token) {
            setError('Authentication token not found.');
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const response = await axios.get('/api/orders', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setOrders(response.data.data);
        } catch (err) {
            setError('Failed to fetch orders. Make sure you have admin privileges and the backend is running.');
            console.error('Error fetching all orders:', err);
            toast.error('Failed to fetch orders.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, [token]);

    const handleStatusChange = async (orderId, newStatus) => {
        if (!token) {
            toast.error('Authentication token not found.');
            return;
        }
        try {
            await axios.put(
                `/api/orders/${orderId}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
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
        <div className="order-management-container">
            <h3>Order Management</h3>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Customer</th>
                            <th>Total Amount</th>
                            <th>Status</th>
                            <th>Items</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user.firstName} {order.user.lastName}</td>
                                <td>${order.totalAmount.toFixed(2)}</td>
                                <td>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        className={`status-dropdown ${order.status.toLowerCase()}`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td>
                                    <ul>
                                        {order.items.map((item) => (
                                            <li key={item.product._id}>
                                                {item.product.name} ({item.quantity} units)
                                                {item.product.blockchainItemId && (
                                                    <span className="blockchain-id"> (Blockchain ID: {item.product.blockchainItemId})</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    {/* Additional actions like View Details, etc. */}
                                    <button className="view-details-btn">View</button>
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