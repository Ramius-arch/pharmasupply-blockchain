// models/product.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  manufacturer: { type: String },
  supplier: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
  category: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  quantityInStock: { type: Number, default: 0 },
  dosageForm: { type: String },
  strength: { type: String },
  pharmaceuticalCode: { type: String, unique: true },
  blockchainItemId: { type: String },
  // Pharma-critical fields
  batchNumber: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  manufacturingDate: { type: Date },
  storageConditions: { type: String }, // e.g., "Store below 25°C"
  requiresPrescription: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
