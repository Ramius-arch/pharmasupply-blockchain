// models/inventory.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const InventorySchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', InventorySchema);
