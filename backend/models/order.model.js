// models/order.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
  supplier: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true }, // Reference to Supplier model
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String }
  },
  status: {
    type: String,
    default: 'pending', // pending, processing, shipped, delivered, cancelled
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  }
});

module.exports = mongoose.model('Order', OrderSchema);
