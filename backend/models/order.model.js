// models/order.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  supplier: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 }
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
    default: 'pending',
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  },
  paymentStatus: {
    type: String,
    default: 'unpaid',
    enum: ['unpaid', 'paid', 'refunded']
  },
  blockchainTxHash: { type: String, default: null } // Link to blockchain transaction
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
