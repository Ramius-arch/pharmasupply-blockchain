import React from 'react';
import './OrderSummary.css';

const OrderSummary = ({ items, totalAmount }) => {
  return (
    <div className="order-summary">
      <h3>Order Details</h3>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} x {item.quantity} - ${ (item.price / 100) * item.quantity }
          </li>
        ))}
      </ul>
      <hr />
      <p>Subtotal: ${(items.reduce((acc, item) => acc + (item.price/100)*item.quantity, 0)).toFixed(2)}</p>
      {/* Add shipping costs and taxes if applicable */}
      <p>Total: ${ (totalAmount / 100).toFixed(2) }</p>
    </div>
  );
};

export default OrderSummary;
