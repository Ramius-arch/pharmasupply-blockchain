import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; // Import CartProvider
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Sidebar from './components/Layout/Sidebar.jsx'; // Import Sidebar
import Home from './components/Home/Home.jsx';
import Login from './components/Login/Login.jsx';
import Register from './components/Register/Register.jsx';
import Products from './pages/Product.jsx';
import ProductDetails from './components/ProductDetails/ProductDetails.jsx';
import Cart from './components/Cart/Cart.jsx';
import Checkout from './components/Checkout/Checkout.jsx';
import AdminDashboard from './components/AdminDashboard/AdminDashboard.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx'; // Import Dashboard
import MyOrders from './pages/MyOrders.jsx'; // Import MyOrders
import GenerateWallet from './components/GenerateWallet/GenerateWallet.jsx'; // Import GenerateWallet
import TransactionHistory from './components/Blockchain/TransactionHistory.jsx'; // Import TransactionHistory
import ForgotPassword from './components/ForgotPassword/ForgotPassword.jsx'; // Import ForgotPassword

import Breadcrumbs from './components/Layout/Breadcrumbs.jsx'; // Import Breadcrumbs

// Styles
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider> {/* Wrap with CartProvider */}
          <div className="app-container"> {/* Add a container for layout */}
            <Sidebar />
            <div className="main-content">
              <Breadcrumbs />
              <main className="content-wrap"> {/* Wrap content in a main tag */}
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/my-orders" element={<MyOrders />} /> {/* My Orders route */}
                  {/* Admin routes - protected by authentication middleware would go here */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/generate-wallet" element={<GenerateWallet />} /> {/* New route for wallet generation */}
                  <Route path="/blockchain-transaction" element={<TransactionHistory />} /> {/* New route for transaction history */}
                </Routes>
              </main>
              <ToastContainer /> {/* Toast container should be rendered once at the root */}
            </div>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;