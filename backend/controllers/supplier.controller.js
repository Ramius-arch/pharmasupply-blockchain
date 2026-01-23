const supplierService = require('../services/supplier.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/apiError');

exports.createSupplier = catchAsync(async (req, res) => {
    const supplier = await supplierService.createSupplier(req.body);
    res.status(201).json({
        message: 'Supplier created successfully',
        data: supplier,
    });
});

exports.getAllSuppliers = catchAsync(async (req, res) => {
    const suppliers = await supplierService.getAllSuppliers(req.query);
    res.status(200).json({
        results: suppliers.length,
        data: suppliers,
    });
});

exports.getSupplierById = catchAsync(async (req, res, next) => {
    const supplier = await supplierService.getSupplierById(req.params.id);
    if (!supplier) {
        return next(new AppError('No supplier found with that ID', 404));
    }
    res.status(200).json({ data: supplier });
});

exports.updateSupplier = catchAsync(async (req, res, next) => {
    const supplier = await supplierService.updateSupplier(req.params.id, req.body);
    if (!supplier) {
        return next(new AppError('No supplier found with that ID', 404));
    }
    res.status(200).json({
        message: 'Supplier updated successfully',
        data: supplier,
    });
});

exports.deleteSupplier = catchAsync(async (req, res, next) => {
    const supplier = await supplierService.deleteSupplier(req.params.id);
    if (!supplier) {
        return next(new AppError('No supplier found with that ID', 404));
    }
    res.status(204).send(); // 204 No Content
});