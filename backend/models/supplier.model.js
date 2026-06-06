// models/supplier.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const SupplierSchema = new Schema({
  name: { type: String, required: true },
  contactEmail: { type: String, required: true, unique: true },
  phone: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String }
  },
  licenseNumber: { type: String, unique: true },
  licenseExpiryDate: { type: Date }, // Supplier licenses expire in real world
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'approved', 'rejected']
  }
}, { timestamps: true });

module.exports = mongoose.model('Supplier', SupplierSchema);
