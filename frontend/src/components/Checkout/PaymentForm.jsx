import React from 'react';
import './PaymentForm.css';

const PaymentForm = ({ method, onChange }) => {
  return (
    <div className="payment-form">
      <h3>Payment Method</h3>
      {/* Add payment form fields based on the selected method */}
      {method === 'credit' && (
        <>
          <label>Card Number:</label>
          <input type="text" />

          <label>Expiration Date:</label>
          <input type="month" />

          <label>CVV:</label>
          <input type="password" />
        </>
      )}
      {/* Add other payment methods like PayPal, etc. */}
    </div>
  );
};

export default PaymentForm;
