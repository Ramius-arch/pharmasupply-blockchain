import React, { useState, useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import orderService from '../../api/orderService';
import './Checkout.css';

// Import the missing components
import OrderSummary from './OrderSummary';
import ShippingForm from './ShippingForm';
import PaymentForm from './PaymentForm';

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user, loading: isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: user?.phone || ''
  });
  const [paymentMethod, setPaymentMethod] = useState('credit');

  // Calculate total amount
  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (isLoading) return <div className="loading">Initializing Secure Checkout...</div>;

  if (!user) {
    return (
      <div className="checkout-wrapper">
        <h2>Checkout</h2>
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <p style={{ marginBottom: '24px' }}>Session expired or not authenticated.</p>
          <Link to="/login" className="btn btn-primary">Sign In to Continue</Link>
        </div>
      </div>
    );
  }

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
    if (!shippingAddress.address1 || !shippingAddress.city) {
      return toast.error('Please provide a valid shipping address.');
    }

    setProcessing(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: `${shippingAddress.address1}, ${shippingAddress.address2 ? shippingAddress.address2 + ', ' : ''}${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}`,
        paymentMethod,
        totalAmount
      };

      const response = await orderService.createOrder(orderData, user.token);
      
      toast.success('Inventory Secured & Blockchain Log Created!');
      clearCart();
      navigate('/checkout/success');
    } catch (err) {
      console.error('Checkout failed:', err);
      toast.error(err.response?.data?.message || 'Transaction failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="checkout-wrapper">
      <div className="checkout-header">
        <h2>Shipment Authentication</h2>
        <p className="subtitle">Verify manifests and shipping destination</p>
      </div>
      
      {cartItems.length === 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <p>Your shipment cart is empty.</p>
          <Link to="/products" className="btn btn-outline mt-4">Browse Products</Link>
        </div>
      ) : (
        <div className="checkout-grid">
          <div className="checkout-main">
            <section className="checkout-section card">
              <h3>Shipping Information</h3>
              <ShippingForm onChange={handleShippingChange} values={shippingAddress} />
            </section>

            <section className="checkout-section card mt-6">
              <h3>Payment Method</h3>
              <PaymentForm method={paymentMethod} onChange={handlePaymentChange} />
            </section>
          </div>

          <aside className="checkout-sidebar">
            <div className="card sticky-top">
              <h3>Order Summary</h3>
              <OrderSummary items={cartItems} totalAmount={totalAmount} />
              
              <button 
                className="btn btn-primary btn-large mt-6" 
                onClick={checkoutHandler}
                disabled={processing}
                style={{ width: '100%' }}
              >
                {processing ? 'Processing Ledger...' : 'Authenticate & Ship'}
              </button>
              
              <div className="security-note">
                🔒 SSL Encrypted Checkout
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Checkout;
