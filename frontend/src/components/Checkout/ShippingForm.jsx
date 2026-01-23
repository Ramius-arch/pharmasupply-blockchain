import React from 'react';
import './ShippingForm.css';

const ShippingForm = ({ onChange, values }) => {
  return (
    <div className="shipping-form">
      <h3>Shipping Address</h3>
      <label>First Name:</label>
      <input type="text" name="firstName" value={values.firstName} onChange={onChange} />

      <label>Last Name:</label>
      <input type="text" name="lastName" value={values.lastName} onChange={onChange} />

      <label>Address Line 1:</label>
      <input type="text" name="address1" value={values.address1} onChange={onChange} required />

      <label>Address Line 2:</label>
      <input type="text" name="address2" value={values.address2} onChange={onChange} />

      <label>City:</label>
      <input type="text" name="city" value={values.city} onChange={onChange} required />

      <label>State:</label>
      <input type="text" name="state" value={values.state} onChange={onChange} required />

      <label>Zip Code:</label>
      <input type="text" name="zipCode" value={values.zipCode} onChange={onChange} required pattern="\d{5}" />

      <label>Phone Number:</label>
      <input type="tel" name="phoneNumber" value={values.phoneNumber} onChange={onChange} />
    </div>
  );
};

export default ShippingForm;
