// models/product.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  manufacturer: { type: String },
  supplier: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true }, // Reference to Supplier model
  category: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  quantityInStock: { type: Number, default: 0 },
  dosageForm: { type: String },
  strength: { type: String },
  pharmaceuticalCode: { type: String, unique: true }, // Unique identifier like NDC or barcode
  blockchainItemId: { type: String } // Reference to item ID on the blockchain
});

module.exports = mongoose.model('Product', ProductSchema);
