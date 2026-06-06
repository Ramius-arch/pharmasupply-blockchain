const Order = require('../models/order.model');
const Product = require('../models/product.model');
const blockchainService = require('./blockchain.service');

/**
 * Valid order status transitions.
 * Maps current status → array of allowed next statuses.
 */
const VALID_STATUS_TRANSITIONS = {
    pending: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [],     // Terminal state — no further transitions
    cancelled: []      // Terminal state — no further transitions
};

/**
 * @dev Creates a new order with stock validation and deduction.
 *      Verifies each product has sufficient stock before placing the order.
 * @param {object} orderData - The data for the new order.
 * @returns {Promise<Order>} The newly created order document.
 */
exports.createOrder = async (orderData) => {
    // Validate items array is non-empty
    if (!orderData.items || orderData.items.length === 0) {
        throw new Error('Order must contain at least one item');
    }

    // Validate stock availability for all items BEFORE creating the order
    for (const item of orderData.items) {
        const product = await Product.findById(item.product);
        if (!product) {
            throw new Error(`Product ${item.product} not found`);
        }
        if (product.quantityInStock < item.quantity) {
            throw new Error(
                `Insufficient stock for "${product.name}". Available: ${product.quantityInStock}, Requested: ${item.quantity}`
            );
        }
        // Reject expired products
        if (product.expiryDate && new Date(product.expiryDate) <= new Date()) {
            throw new Error(`Product "${product.name}" has expired and cannot be ordered`);
        }
    }

    // Deduct stock for all items
    for (const item of orderData.items) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: { quantityInStock: -item.quantity }
        });
    }

    const order = new Order(orderData);
    return await order.save();
};

/**
 * @dev Retrieves orders from the database.
 *      Can fetch all orders (for admins) or a specific user's orders.
 * @param {object} filter - Query filter to apply (e.g., { user: userId }).
 * @returns {Promise<Array<Order>>} An array of order documents.
 */
exports.getOrders = async (filter = {}) => {
    return await Order.find(filter)
        .populate('user', 'firstName lastName email')
        .populate({
            path: 'items.product',
            select: 'name blockchainItemId batchNumber expiryDate'
        })
        .sort({ createdAt: -1 }); // Newest orders first
};

/**
 * @dev Retrieves a single order by its ID.
 * @param {string} orderId - The ID of the order to retrieve.
 * @returns {Promise<Order|null>} The order document or null if not found.
 */
exports.getOrderById = async (orderId) => {
    return await Order.findById(orderId)
        .populate('user', 'firstName lastName email')
        .populate({
            path: 'items.product',
            select: 'name blockchainItemId batchNumber expiryDate'
        });
};

/**
 * @dev Updates an order's status with transition validation and blockchain sync.
 *      Enforces valid status transitions and restores stock on cancellation.
 * @param {string} orderId - The ID of the order to update.
 * @param {string} newStatus - The new status for the order.
 * @returns {Promise<Order|null>} The updated order document or null if not found.
 */
exports.updateOrderStatus = async (orderId, newStatus) => {
    // Fetch the current order to validate the transition
    const currentOrder = await Order.findById(orderId).populate({
        path: 'items.product',
        select: 'blockchainItemId'
    });

    if (!currentOrder) {
        return null;
    }

    // Validate the status transition
    const currentStatus = currentOrder.status;
    const allowedTransitions = VALID_STATUS_TRANSITIONS[currentStatus];

    if (!allowedTransitions) {
        throw new Error(`Unknown current status: ${currentStatus}`);
    }

    if (!allowedTransitions.includes(newStatus)) {
        throw new Error(
            `Invalid status transition: "${currentStatus}" → "${newStatus}". Allowed: [${allowedTransitions.join(', ')}]`
        );
    }

    // Restore stock on cancellation
    if (newStatus === 'cancelled') {
        for (const item of currentOrder.items) {
            await Product.findByIdAndUpdate(item.product._id || item.product, {
                $inc: { quantityInStock: item.quantity }
            });
        }
    }

    // Update the order status
    const updatedOrder = await Order.findByIdAndUpdate(
        orderId, { status: newStatus }, { new: true, runValidators: true }
    ).populate({
        path: 'items.product',
        select: 'blockchainItemId'
    });

    // Sync status to blockchain
    if (updatedOrder && updatedOrder.items) {
        let blockchainStatus;
        switch (newStatus.toLowerCase()) {
            case 'pending':
                blockchainStatus = 'Created';
                break;
            case 'processing':
            case 'shipped':
                blockchainStatus = 'InTransit';
                break;
            case 'delivered':
                blockchainStatus = 'Delivered';
                break;
            case 'cancelled':
                blockchainStatus = 'Canceled';
                break;
            default:
                console.warn(`Unknown order status: ${newStatus}. Not updating blockchain.`);
                blockchainStatus = null;
        }

        if (blockchainStatus) {
            const results = await Promise.allSettled(
                updatedOrder.items.map(async (item) => {
                    if (item.product && item.product.blockchainItemId) {
                        try {
                            await blockchainService.updateItemStatusOnBlockchain(
                                item.product.blockchainItemId,
                                blockchainStatus
                            );
                            console.log(`Blockchain item ${item.product.blockchainItemId} status updated to ${blockchainStatus} for order ${orderId}`);
                            return { success: true, itemId: item.product.blockchainItemId };
                        } catch (error) {
                            console.error(`Failed to update blockchain status for item ${item.product.blockchainItemId} in order ${orderId}:`, error);
                            return { success: false, itemId: item.product.blockchainItemId, error: error.message };
                        }
                    }
                    return { success: true, skipped: true };
                })
            );

            const failures = results.filter(r => r.status === 'rejected' || (r.value && !r.value.success));
            if (failures.length > 0) {
                console.error(`Warning: ${failures.length} blockchain updates failed for order ${orderId}`);
            }
        }
    }

    return updatedOrder;
};