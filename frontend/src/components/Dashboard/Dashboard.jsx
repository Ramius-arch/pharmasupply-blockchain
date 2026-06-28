import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClipboardList,
  faBoxOpen,
  faLink,
  faPills,
  faArrowRight,
  faShoppingCart,
  faHistory,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/AuthContext';
import orderService from '../../api/orderService';
import productService from '../../api/productService';
import LoadingSpinner from '../UI/LoadingSpinner';
import './Dashboard.css';

const quickActions = [
  { label: 'Browse Catalog', to: '/products', icon: faPills, color: 'var(--primary)' },
  { label: 'View Cart', to: '/cart', icon: faShoppingCart, color: 'var(--secondary)' },
  { label: 'My Orders', to: '/my-orders', icon: faBoxOpen, color: 'var(--warning)' },
  { label: 'Ledger Log', to: '/blockchain-transaction', icon: faLink, color: 'var(--info)' },
];

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = user?.token;
        const [ordersRes, productsRes] = await Promise.all([
          orderService.getMyOrders(token),
          productService.getAllProducts(),
        ]);
        setOrders(Array.isArray(ordersRes) ? ordersRes : ordersRes.data || []);
        setProducts(Array.isArray(productsRes) ? productsRes : productsRes.data || []);
      } catch (err) {
        setError('Unable to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.token]);

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." fullScreen />;
  }

  const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'processing').length;
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Welcome back, {user?.firstName || 'User'}</h1>
          <p className="dashboard-subtitle">
            Here is what is happening across your pharmaceutical supply chain today.
          </p>
        </div>
      </div>

      {error && (
        <div className="dashboard-alert dashboard-alert-warning">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          {error}
        </div>
      )}

      <div className="dashboard-grid">
        <div className="stat-card animate-fade-in" style={{ animationDelay: '0ms' }}>
          <div className="stat-icon" style={{ color: 'var(--primary)', background: 'var(--primary-soft)' }}>
            <FontAwesomeIcon icon={faClipboardList} />
          </div>
          <div>
            <div className="stat-label">Total Orders</div>
            <div className="stat-value">{orders.length}</div>
          </div>
        </div>

        <div className="stat-card animate-fade-in" style={{ animationDelay: '60ms' }}>
          <div className="stat-icon" style={{ color: 'var(--warning)', background: 'rgba(245, 158, 11, 0.12)' }}>
            <FontAwesomeIcon icon={faBoxOpen} />
          </div>
          <div>
            <div className="stat-label">Pending Shipments</div>
            <div className="stat-value">{pendingOrders}</div>
          </div>
        </div>

        <div className="stat-card animate-fade-in" style={{ animationDelay: '120ms' }}>
          <div className="stat-icon" style={{ color: 'var(--secondary)', background: 'rgba(16, 185, 129, 0.12)' }}>
            <FontAwesomeIcon icon={faLink} />
          </div>
          <div>
            <div className="stat-label">Verified Products</div>
            <div className="stat-value">{products.length}</div>
          </div>
        </div>

        <div className="stat-card animate-fade-in" style={{ animationDelay: '180ms' }}>
          <div className="stat-icon" style={{ color: 'var(--info)', background: 'rgba(6, 182, 212, 0.12)' }}>
            <FontAwesomeIcon icon={faHistory} />
          </div>
          <div>
            <div className="stat-label">Total Spent</div>
            <div className="stat-value">${totalSpent.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section card">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions-grid">
            {quickActions.map((action) => (
              <Link key={action.label} to={action.to} className="quick-action-card">
                <div className="quick-action-icon" style={{ color: action.color }}>
                  <FontAwesomeIcon icon={action.icon} />
                </div>
                <span>{action.label}</span>
                <FontAwesomeIcon icon={faArrowRight} className="quick-action-arrow" />
              </Link>
            ))}
          </div>
        </div>

        <div className="dashboard-section card">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <Link to="/my-orders" className="section-link">
              View all <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="dashboard-empty">
              <FontAwesomeIcon icon={faBoxOpen} />
              <p>No orders yet. Start by browsing the catalog.</p>
              <Link to="/products" className="btn btn-primary">Browse Products</Link>
            </div>
          ) : (
            <ul className="order-list">
              {recentOrders.map((order) => (
                <li key={order._id} className="order-list-item">
                  <div className="order-info">
                    <div className="order-id">#{order._id.slice(-8).toUpperCase()}</div>
                    <div className="order-meta">
                      {order.items?.length || 0} item(s) · {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="order-right">
                    <span className={`status-chip ${order.status}`}>{order.status}</span>
                    <div className="order-amount">${(order.totalAmount || 0).toFixed(2)}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
