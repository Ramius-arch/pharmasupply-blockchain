const orderService = require('../services/order.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/apiError');

exports.createOrder = catchAsync(async (req, res, next) => {
    const { items, supplier, shippingAddress } = req.body;

    // Validate required fields
    if (!items || items.length === 0) {
        return next(new AppError('Order must contain at least one item', 400));
    }
    if (!supplier) {
        return next(new AppError('Supplier is required', 400));
    }

    // Add the authenticated user's ID to the order
    req.body.user = req.user.id;
    const order = await orderService.createOrder(req.body);
    res.status(201).json({
        message: 'Order created successfully',
        data: order,
    });
});

// For admins to get all orders
exports.getAllOrders = catchAsync(async (req, res) => {
    const orders = await orderService.getOrders();
    res.status(200).json({
        results: orders.length,
        data: orders,
    });
});

// For a user to get their own orders
exports.getMyOrders = catchAsync(async (req, res) => {
    const orders = await orderService.getOrders({ user: req.user.id });
    res.status(200).json({
        results: orders.length,
        data: orders,
    });
});

exports.getOrderById = catchAsync(async (req, res, next) => {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) {
        return next(new AppError('No order found with that ID', 404));
    }
    // Security check: Make sure the user is an admin or the owner of the order
    if (order.user.id !== req.user.id && req.user.role !== 'admin') {
        return next(new AppError('You do not have permission to view this order', 403));
    }
    res.status(200).json({ data: order });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
    const { status } = req.body;
    if (!status) {
        return next(new AppError('Status is required for update', 400));
    }
    const order = await orderService.updateOrderStatus(req.params.id, status);
    if (!order) {
        return next(new AppError('No order found with that ID', 404));
    }
    res.status(200).json({
        message: 'Order status updated successfully',
        data: order,
    });
});