const Order = require('../models/order.model');
const blockchainService = require('./blockchain.service');

/**
 * @dev Service function to create a new order in the database.
 *      The user ID and other necessary data are expected to be added in the controller.
 * @param {object} orderData - The data for the new order.
 * @returns {Promise<Order>} The newly created order document.
 */
exports.createOrder = async (orderData) => {
    const order = new Order(orderData);
    return await order.save();
};

/**
 * @dev Service function to retrieve orders from the database.
 *      Can fetch all orders (for admins) or a specific user's orders based on filter.
 *      Populates user and product details.
 * @param {object} filter - Query filter to apply (e.g., { user: userId }).
 * @returns {Promise<Array<Order>>} An array of order documents.
 */
exports.getOrders = async (filter = {}) => {
    return await Order.find(filter)
        .populate('user', 'firstName lastName email') // Populate user details
        .populate({
            path: 'items.product',
            select: 'name blockchainItemId' // Populate product with its blockchainItemId
        });
};

/**
 * @dev Service function to retrieve a single order by its ID.
 *      Populates user and product details.
 * @param {string} orderId - The ID of the order to retrieve.
 * @returns {Promise<Order|null>} The order document or null if not found.
 */
exports.getOrderById = async (orderId) => {
    return await Order.findById(orderId)
        .populate('user', 'firstName lastName email') // Populate user details
        .populate({
            path: 'items.product',
            select: 'name blockchainItemId'
        });
};

/**
 * @dev Service function to update an order's status and reflect this change on the blockchain.
 * @param {string} orderId - The ID of the order to update.
 * @param {string} newStatus - The new status for the order (e.g., "shipped", "delivered").
 * @returns {Promise<Order|null>} The updated order document or null if not found.
 */
exports.updateOrderStatus = async (orderId, newStatus) => {
    // Find and update the order in the database, then populate product details to get blockchainItemId
    const updatedOrder = await Order.findByIdAndUpdate(
        orderId, { status: newStatus }, { new: true, runValidators: true }
    ).populate({
        path: 'items.product',
        select: 'blockchainItemId' // Only need blockchainItemId for updating blockchain
    });

    if (updatedOrder && updatedOrder.items) {
        // Map database status string to blockchain contract's enum string.
        let blockchainStatus;
        switch (newStatus.toLowerCase()) {
            case 'pending':
                blockchainStatus = 'Created'; // Initial status on blockchain
                break;
            case 'processing':
            case 'shipped':
                blockchainStatus = 'InTransit'; // Both processing and shipped mean it's in transit
                break;
            case 'delivered':
                blockchainStatus = 'Delivered';
                break;
            case 'cancelled':
                blockchainStatus = 'Canceled';
                break;
            default:
                console.warn(`Unknown order status: ${newStatus}. Not updating blockchain.`);
                blockchainStatus = null; // Don't attempt to update blockchain for unknown status
        }

        if (blockchainStatus) {
            // Iterate through all products in the order and update their status on the blockchain.
            for (const item of updatedOrder.items) {
                if (item.product && item.product.blockchainItemId) {
                    try {
                        await blockchainService.updateItemStatusOnBlockchain(
                            item.product.blockchainItemId,
                            blockchainStatus
                        );
                        console.log(`Blockchain item ${item.product.blockchainItemId} status updated to ${blockchainStatus} for order ${orderId}`);
                    } catch (error) {
                        console.error(`Failed to update blockchain status for item ${item.product.blockchainItemId} in order ${orderId}:`, error);
                        // In a real application, robust error handling for blockchain failures is crucial:
                        // - Retry mechanism
                        // - Alerting system (e.g., Slack, email)
                        // - Manual intervention process
                        // - Transaction queue for eventual consistency
                    }
                }
            }
        }
    }

    return updatedOrder;
};