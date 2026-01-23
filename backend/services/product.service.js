const Product = require('../models/product.model');
const blockchainService = require('./blockchain.service');

// Create a new product
exports.createProduct = async (productData) => {
    const product = new Product(productData);
    
    // Create item on blockchain
    let blockchainItemId;
    try {
        // Use product name as description for the blockchain item
        blockchainItemId = await blockchainService.createItemOnBlockchain(product.name);
        product.blockchainItemId = blockchainItemId;
    } catch (error) {
        console.error("Failed to create blockchain item for product:", error);
        // Decide how to handle this: rollback DB creation, or just log and continue without blockchain ID
        // For now, we'll log and proceed, but in a real app, strict error handling is needed.
        // throw new Error("Product creation failed due to blockchain error.");
    }

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
    return await Product.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true });
};

// Delete a product by its ID
exports.deleteProduct = async (productId) => {
    // TODO: Consider if the blockchain item should also be "deleted" or marked inactive
    return await Product.findByIdAndDelete(productId);
};
