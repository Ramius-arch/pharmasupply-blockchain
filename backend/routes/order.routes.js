const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controllers');
const { authenticate } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');

// All routes below are protected
router.use(authenticate);

// Create a new order
router.post('/', orderController.createOrder);

// Get all orders (admin only)
router.get(
    '/',
    checkRole(['admin']),
    orderController.getAllOrders
);

// Get all orders for the currently logged-in user
router.get('/my-orders', orderController.getMyOrders);

// Get a single order by ID (user can only see their own, admin can see any)
router.get('/:id', orderController.getOrderById);

// Update an order's status (admin only)
router.put(
    '/:id/status',
    checkRole(['admin']),
    orderController.updateOrderStatus
);

module.exports = router;