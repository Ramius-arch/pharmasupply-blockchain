const productService = require('../services/product.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/apiError');

exports.createProduct = catchAsync(async (req, res) => {
    const product = await productService.createProduct(req.body);
    res.status(201).json({
        message: 'Product created successfully',
        data: product,
    });
});

exports.getAllProducts = catchAsync(async (req, res) => {
    // Basic filtering can be passed from query params if needed
    const products = await productService.getAllProducts(req.query);
    res.status(200).json({
        results: products.length,
        data: products,
    });
});

exports.getProductById = catchAsync(async (req, res, next) => {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
        return next(new AppError('No product found with that ID', 404));
    }
    res.status(200).json({ data: product });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
    const product = await productService.updateProduct(req.params.id, req.body);
    if (!product) {
        return next(new AppError('No product found with that ID', 404));
    }
    res.status(200).json({
        message: 'Product updated successfully',
        data: product,
    });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
    const product = await productService.deleteProduct(req.params.id);
    if (!product) {
        return next(new AppError('No product found with that ID', 404));
    }
    res.status(204).send(); // 204 No Content
});