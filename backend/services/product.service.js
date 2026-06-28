const Product = require('../models/product.model');
const blockchainService = require('./blockchain.service');

// Create a new product
exports.createProduct = async (productData) => {
    // Validate expiry date — reject already expired products
    if (productData.expiryDate && new Date(productData.expiryDate) <= new Date()) {
        throw new Error('Cannot create a product that is already expired');
    }

    // Validate manufacturing date is before expiry date
    if (productData.manufacturingDate && productData.expiryDate) {
        if (new Date(productData.manufacturingDate) >= new Date(productData.expiryDate)) {
            throw new Error('Manufacturing date must be before expiry date');
        }
    }

    const product = new Product(productData);

    // Create item on blockchain
    // If this fails, we do NOT save the product — DB and chain must stay consistent.
    const blockchainItemId = await blockchainService.createItemOnBlockchain(product.name);
    product.blockchainItemId = blockchainItemId;

    return await product.save();
};

// Get all products with optional filtering
exports.getAllProducts = async (filter = {}) => {
    // Basic filtering, can be expanded
    return await Product.find(filter);
};

// Get a single product by its ID
exports.getProductById = async (productId) => {
    return await Product.findById(productId);
};

// Update a product by its ID
exports.updateProduct = async (productId, updateData) => {
    // Prevent stock from going negative
    if (updateData.quantityInStock !== undefined && updateData.quantityInStock < 0) {
        throw new Error('Stock quantity cannot be negative');
    }
    return await Product.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true });
};

// Delete a product by its ID
exports.deleteProduct = async (productId) => {
    // TODO: Consider if the blockchain item should also be "deleted" or marked inactive
    return await Product.findByIdAndDelete(productId);
};
