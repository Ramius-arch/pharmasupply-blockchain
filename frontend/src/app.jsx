import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Sidebar from './components/Layout/Sidebar.jsx';
import Header from './components/Layout/Header.jsx';
import ProtectedRoute from './components/Layout/ProtectedRoute.jsx';
import Home from './components/Home/Home.jsx';
import Login from './components/Login/Login.jsx';
import Register from './components/Register/Register.jsx';
import Products from './pages/Product.jsx';
import ProductDetails from './components/ProductDetails/ProductDetails.jsx';
import Cart from './components/Cart/Cart.jsx';
import Checkout from './components/Checkout/Checkout.jsx';
import AdminDashboard from './components/AdminDashboard/AdminDashboard.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import MyOrders from './pages/MyOrders.jsx';
import GenerateWallet from './components/GenerateWallet/GenerateWallet.jsx';
import TransactionHistory from './components/Blockchain/TransactionHistory.jsx';
import ForgotPassword from './components/ForgotPassword/ForgotPassword.jsx';

import Breadcrumbs from './components/Layout/Breadcrumbs.jsx';

// Styles
import './App.css';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className={`app-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

            {/* Mobile Overlay */}
            {sidebarOpen && (
              <div className="sidebar-overlay" onClick={closeSidebar}></div>
            )}

            <div className="main-content">
              <Header onToggleSidebar={toggleSidebar} />

              <div className="desktop-breadcrumb-wrap">
                <Breadcrumbs />
              </div>

              <main className="content-wrap" onClick={closeSidebar}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetails />} />

                  {/* Protected routes — authenticated users only */}
                  <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                  <Route path="/generate-wallet" element={<ProtectedRoute><GenerateWallet /></ProtectedRoute>} />
                  <Route path="/blockchain-transaction" element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />

                  {/* Admin/Supplier routes — role-restricted */}
                  <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin', 'supplier']}><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'supplier']}><Dashboard /></ProtectedRoute>} />
                </Routes>
              </main>
              <ToastContainer />
            </div>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};
export default App;