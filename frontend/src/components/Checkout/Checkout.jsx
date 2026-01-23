import React, { useState, useContext } from 'react';
import { CartContext } from '../../context/CartContext'; // Directly import CartContext
import { AuthContext } from '../../context/AuthContext'; // Directly import AuthContext
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { toast } from 'react-toastify'; // Added toast for notifications
import './Checkout.css';

// Import the missing components
import OrderSummary from './OrderSummary';
import ShippingForm from './ShippingForm';
import PaymentForm from './PaymentForm';

const Checkout = () => {
  const { cartItems, checkout, clearCart } = useContext(CartContext); // Use useContext
  const { user, loading: isLoading } = useContext(AuthContext); // Use useContext
  const navigate = useNavigate(); // Initialize useNavigate

  // Calculate total amount within the component or pass it from CartContext if available
  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (isLoading) return <div className="loading">Loading...</div>;

  if (!user) {
    return (
      <div className="checkout-wrapper">
        <h2>Checkout</h2>
        <p>Please login to continue</p>
        <Link to="/login">Login Now</Link>
      </div>
    );
  }

  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('credit'); // or 'paypal' etc.

  const handleShippingChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const checkoutHandler = async () => {
    // --- MOCK PAYMENT PROCESSING ---
    console.log('Mock Checkout process initiated');
    console.log('Shipping Address:', shippingAddress);
    console.log('Payment Method:', paymentMethod);
    console.log('Cart Items:', cartItems);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate success
    toast.success('Mock Payment Successful! Your order has been placed.');
    clearCart(); // Clear the cart after successful checkout
    navigate('/checkout/success'); // Redirect to success page

    // In a real application, you would typically:
    // 1. Validate shipping/payment details
    // 2. Create an order in your backend system
    // 3. Process payment through a payment gateway (e.g., Stripe, PayPal)
    // 4. Update inventory
    // 5. Send confirmation emails
  };

  return (
    <div className="checkout-wrapper">
      <h2>Checkout</h2>
      {cartItems.length === 0 && <p>Your cart is empty</p>}

      {cartItems.length > 0 && (
        <>
          <h3>Order Summary</h3>
          <OrderSummary items={cartItems} totalAmount={totalAmount} />

          <h3>Shipping Information</h3>
          <ShippingForm onChange={handleShippingChange} values={shippingAddress} />

          <h3>Payment Method</h3>
          <PaymentForm method={paymentMethod} onChange={handlePaymentChange} />

          {/* Add a button to review order before final submission */}
          <button onClick={checkoutHandler}>Review Order & Pay</button>
        </>
      )}

      {/* Footer or other checkout elements can go here */}
    </div>
  );
};

export default Checkout;
