const orderService = require('../../services/order.service');
const Order = require('../../models/order.model');
const Product = require('../../models/product.model');
const blockchainService = require('../../services/blockchain.service');

// Mock external modules
jest.mock('../../models/order.model');
jest.mock('../../models/product.model');
jest.mock('../../services/blockchain.service');

describe('Order Service', () => {
    let mockOrder;
    let mockProductA, mockProductB;

    // Helper function to create a mock query chainable with .populate() and .sort()
    const createMockQuery = (resolvedData) => {
        const queryMock = {
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue(resolvedData),
            then: jest.fn(function (resolve, reject) {
                return this.exec().then(resolve, reject);
            }),
        };
        return queryMock;
    };

    beforeEach(() => {
        jest.clearAllMocks();

        mockProductA = { _id: 'prod1', name: 'Product A', blockchainItemId: '1', unitPrice: 10, quantityInStock: 100, expiryDate: new Date('2028-12-31') };
        mockProductB = { _id: 'prod2', name: 'Product B', blockchainItemId: '2', unitPrice: 20, quantityInStock: 50, expiryDate: new Date('2028-12-31') };

        mockOrder = {
            _id: 'order123',
            user: { _id: 'user123', firstName: 'Test', lastName: 'User', email: 'test@test.com' },
            supplier: 'supp123',
            items: [
                { product: mockProductA, quantity: 1, unitPrice: 10 },
                { product: mockProductB, quantity: 2, unitPrice: 20 },
            ],
            totalAmount: 50,
            status: 'pending',
            shippingAddress: { street: '123 Test St', city: 'Test City', state: 'TS', zipCode: '12345' },
            save: jest.fn().mockResolvedValue(this),
            toObject: jest.fn().mockReturnValue({ ...this }),
        };

        // Mock the Order constructor
        Order.mockImplementation(function (data) {
            Object.assign(this, data);
            this._id = this._id || 'newOrder123';
            this.save = jest.fn().mockResolvedValue(this);
            this.populate = jest.fn().mockReturnThis();
            this.exec = jest.fn().mockResolvedValue(this);
        });

        // Mock static methods to return a fresh mock query each time
        Order.find = jest.fn(() => createMockQuery([mockOrder]));
        Order.findById = jest.fn(() => createMockQuery(mockOrder));
        Order.findByIdAndUpdate = jest.fn(() => createMockQuery(mockOrder));

        // Mock Product.findById for stock validation
        Product.findById = jest.fn((id) => {
            if (id === 'prod1') return Promise.resolve(mockProductA);
            if (id === 'prod2') return Promise.resolve(mockProductB);
            return Promise.resolve(null);
        });

        // Mock Product.findByIdAndUpdate for stock deduction
        Product.findByIdAndUpdate = jest.fn().mockResolvedValue({});
    });

    describe('createOrder', () => {
        it('should create a new order with stock validation and deduction', async () => {
            const orderData = {
                user: 'user123',
                supplier: 'supp123',
                items: [{ product: 'prod1', quantity: 1 }],
                totalAmount: 10,
                shippingAddress: { street: '123 Test St', city: 'Test City', state: 'TS', zipCode: '12345' },
            };
            const createdOrder = await orderService.createOrder(orderData);

            expect(Product.findById).toHaveBeenCalledWith('prod1');
            expect(Product.findByIdAndUpdate).toHaveBeenCalledWith('prod1', { $inc: { quantityInStock: -1 } });
            expect(Order).toHaveBeenCalledWith(orderData);
            expect(createdOrder.save).toHaveBeenCalledTimes(1);
        });

        it('should reject order if items array is empty', async () => {
            await expect(
                orderService.createOrder({ items: [] })
            ).rejects.toThrow('Order must contain at least one item');
        });

        it('should reject order if stock is insufficient', async () => {
            const orderData = {
                items: [{ product: 'prod1', quantity: 999 }],
            };
            await expect(
                orderService.createOrder(orderData)
            ).rejects.toThrow('Insufficient stock');
        });
    });

    describe('getOrders', () => {
        it('should return all orders with populated user and product info', async () => {
            const orders = await orderService.getOrders({});

            const findQueryMock = Order.find.mock.results[0].value;

            expect(Order.find).toHaveBeenCalledWith({});
            expect(findQueryMock.populate).toHaveBeenCalledTimes(2);
            expect(findQueryMock.populate.mock.calls[0]).toEqual(['user', 'firstName lastName email']);
            expect(findQueryMock.populate.mock.calls[1]).toEqual([{ path: 'items.product', select: 'name blockchainItemId batchNumber expiryDate' }]);
            expect(findQueryMock.sort).toHaveBeenCalledWith({ createdAt: -1 });
            expect(orders).toEqual([mockOrder]);
        });
    });

    describe('getOrderById', () => {
        it('should return an order by ID with populated user and product info', async () => {
            const order = await orderService.getOrderById('order123');

            const findByIdQueryMock = Order.findById.mock.results[0].value;

            expect(Order.findById).toHaveBeenCalledWith('order123');
            expect(findByIdQueryMock.populate).toHaveBeenCalledTimes(2);
            expect(findByIdQueryMock.populate.mock.calls[0]).toEqual(['user', 'firstName lastName email']);
            expect(findByIdQueryMock.populate.mock.calls[1]).toEqual([{ path: 'items.product', select: 'name blockchainItemId batchNumber expiryDate' }]);
            expect(order).toEqual(mockOrder);
        });
    });

    describe('updateOrderStatus', () => {
        it('should update order status with valid transition and sync blockchain', async () => {
            // Mock findById for transition validation — order is 'pending'
            const pendingOrder = { ...mockOrder, status: 'pending' };
            const findByIdQuery = createMockQuery(pendingOrder);
            Order.findById.mockReturnValueOnce(findByIdQuery);

            const updatedMockOrder = { ...mockOrder, status: 'processing' };
            const updateQueryMock = createMockQuery(updatedMockOrder);
            Order.findByIdAndUpdate.mockReturnValue(updateQueryMock);

            blockchainService.updateItemStatusOnBlockchain.mockResolvedValue(true);

            const result = await orderService.updateOrderStatus('order123', 'processing');

            expect(Order.findByIdAndUpdate).toHaveBeenCalledWith('order123', { status: 'processing' }, { new: true, runValidators: true });
            expect(blockchainService.updateItemStatusOnBlockchain).toHaveBeenCalledWith(mockProductA.blockchainItemId, 'InTransit');
            expect(blockchainService.updateItemStatusOnBlockchain).toHaveBeenCalledWith(mockProductB.blockchainItemId, 'InTransit');
            expect(result.status).toBe('processing');
        });

        it('should reject invalid status transitions', async () => {
            // Mock findById — order is 'delivered' (terminal state)
            const deliveredOrder = { ...mockOrder, status: 'delivered' };
            const findByIdQuery = createMockQuery(deliveredOrder);
            Order.findById.mockReturnValueOnce(findByIdQuery);

            await expect(
                orderService.updateOrderStatus('order123', 'pending')
            ).rejects.toThrow('Invalid status transition');
        });

        it('should restore stock on cancellation', async () => {
            const pendingOrder = { ...mockOrder, status: 'pending' };
            const findByIdQuery = createMockQuery(pendingOrder);
            Order.findById.mockReturnValueOnce(findByIdQuery);

            const cancelledMockOrder = { ...mockOrder, status: 'cancelled' };
            const updateQueryMock = createMockQuery(cancelledMockOrder);
            Order.findByIdAndUpdate.mockReturnValue(updateQueryMock);

            blockchainService.updateItemStatusOnBlockchain.mockResolvedValue(true);

            await orderService.updateOrderStatus('order123', 'cancelled');

            // Should restore stock for both products
            expect(Product.findByIdAndUpdate).toHaveBeenCalledWith('prod1', { $inc: { quantityInStock: 1 } });
            expect(Product.findByIdAndUpdate).toHaveBeenCalledWith('prod2', { $inc: { quantityInStock: 2 } });
        });

        it('should handle blockchain update failure gracefully', async () => {
            const pendingOrder = { ...mockOrder, status: 'pending' };
            const findByIdQuery = createMockQuery(pendingOrder);
            Order.findById.mockReturnValueOnce(findByIdQuery);

            const updatedMockOrder = { ...mockOrder, status: 'processing' };
            const updateQueryMock = createMockQuery(updatedMockOrder);
            Order.findByIdAndUpdate.mockReturnValue(updateQueryMock);

            blockchainService.updateItemStatusOnBlockchain.mockRejectedValue(new Error('Blockchain failed'));

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

            const result = await orderService.updateOrderStatus('order123', 'processing');

            expect(blockchainService.updateItemStatusOnBlockchain).toHaveBeenCalledTimes(updatedMockOrder.items.length);
            expect(consoleErrorSpy).toHaveBeenCalled();
            expect(result.status).toBe('processing');

            consoleErrorSpy.mockRestore();
        });
    });
});
