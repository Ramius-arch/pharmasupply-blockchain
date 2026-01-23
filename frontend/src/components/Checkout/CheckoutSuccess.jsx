import React from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import './CheckoutSuccess.css';

const CheckoutSuccess = () => {
  const { clearCart } = useCart();

  const handleContinueShopping = () => {
    clearCart();
    // Redirect to home or product listing page
  };

  return (
    <div className="checkout-success">
      <h2>Thank you for your order!</h2>
      {/* Display order confirmation details here */}
      <p>Your order has been placed successfully.</p>
      {/* Add a button to view order details or track shipment */}
      <button onClick={handleContinueShopping}>Continue Shopping</button>
    </div>
  );
};

export default CheckoutSuccess;
