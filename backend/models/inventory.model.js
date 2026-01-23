// models/inventory.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const InventorySchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, // Reference to Product model
  quantity: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inventory', InventorySchema);
