import React, { useContext } from 'react';
import './Cart.css';
import { Link } from 'react-router-dom';
import { faTrash } from '@fortawesome/free-solid-svg-icons'; // For delete icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Import your context (assuming you have a CartContext)
import { CartContext } from '../../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, checkout } = useContext(CartContext);

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your Cart is Empty</h2>
        <p>Add some products to get started!</p>
        <Link to="/products">Browse Products</Link>
      </div>
    );
  }

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {/* Cart Items Display */}
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} />
            <div>
              <h3>{item.name}</h3>
              <p>${(item.price / 100).toFixed(2)} x {item.quantity}</p>
            </div>
            <div>
              {/* Quantity controls */}
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                -
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                +
              </button>
            </div>
            <div>
              {/* Remove from cart button */}
              <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                Remove <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total and Checkout Summary */}
      <div className="cart-summary">
        <div>Total: ${total.toFixed(2)}</div>
        <Link to="/checkout" className="checkout-btn">
          Checkout <FontAwesomeIcon icon={faTrash} />
        </Link>
      </div>
    </div>
  );
};

export default Cart;
