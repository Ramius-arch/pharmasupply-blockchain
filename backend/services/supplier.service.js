const Supplier = require('../models/supplier.model');

// Create a new supplier
exports.createSupplier = async (supplierData) => {
    const supplier = new Supplier(supplierData);
    return await supplier.save();
};

// Get all suppliers
exports.getAllSuppliers = async (filter = {}) => {
    return await Supplier.find(filter);
};

// Get a single supplier by its ID
exports.getSupplierById = async (supplierId) => {
    return await Supplier.findById(supplierId);
};

// Update a supplier by its ID
exports.updateSupplier = async (supplierId, updateData) => {
    return await Supplier.findByIdAndUpdate(supplierId, updateData, { new: true, runValidators: true });
};

// Delete a supplier by its ID
exports.deleteSupplier = async (supplierId) => {
    return await Supplier.findByIdAndDelete(supplierId);
};