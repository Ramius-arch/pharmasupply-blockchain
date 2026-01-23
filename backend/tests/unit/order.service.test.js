const orderService = require('../../services/order.service');
const Order = require('../../models/order.model');
const blockchainService = require('../../services/blockchain.service');

// Mock external modules
jest.mock('../../models/order.model');
jest.mock('../../services/blockchain.service');

describe('Order Service', () => {
    let mockOrder;
    let mockProductA, mockProductB;

    // Helper function to create a mock query chainable with .populate()
    // It returns a *new* mock object for each call, ensuring isolation.
    const createMockQuery = (resolvedData) => {
        const queryMock = {
            populate: jest.fn().mockReturnThis(), // Allows chaining, returns the queryMock itself
            exec: jest.fn().mockResolvedValue(resolvedData), // Resolves the final data
            then: jest.fn(function(resolve, reject) { // Simulate implicit .then()
                return this.exec().then(resolve, reject);
            }),
        };
        return queryMock;
    };

    beforeEach(() => {
        jest.clearAllMocks();

        mockProductA = { _id: 'prod1', name: 'Product A', blockchainItemId: '1', unitPrice: 10 };
        mockProductB = { _id: 'prod2', name: 'Product B', blockchainItemId: '2', unitPrice: 20 };

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
        Order.mockImplementation(function(data) {
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
    });

    describe('createOrder', () => {
        it('should create a new order', async () => {
            const orderData = {
                user: 'user123',
                supplier: 'supp123',
                items: [{ product: 'prod1', quantity: 1 }],
                totalAmount: 10,
                shippingAddress: { street: '123 Test St', city: 'Test City', state: 'TS', zipCode: '12345' },
            };
            const createdOrder = await orderService.createOrder(orderData);

            expect(Order).toHaveBeenCalledWith(orderData);
            expect(createdOrder.save).toHaveBeenCalledTimes(1);
            expect(createdOrder.user).toBe('user123');
        });
    });

    describe('getOrders', () => {
        it('should return all orders with populated user and product info', async () => {
            const orders = await orderService.getOrders({});

            // Capture the mock query object from Order.find() for assertion
            const findQueryMock = Order.find.mock.results[0].value; 

            expect(Order.find).toHaveBeenCalledWith({});
            expect(findQueryMock.populate).toHaveBeenCalledTimes(2); // Expect two populate calls
            expect(findQueryMock.populate.mock.calls[0]).toEqual(['user', 'firstName lastName email']);
            expect(findQueryMock.populate.mock.calls[1]).toEqual([{ path: 'items.product', select: 'name blockchainItemId' }]);
            expect(orders).toEqual([mockOrder]); // Expecting the resolved value from exec
        });
    });

    describe('getOrderById', () => {
        it('should return an order by ID with populated user and product info', async () => {
            const order = await orderService.getOrderById('order123');

            // Capture the mock query object from Order.findById() for assertion
            const findByIdQueryMock = Order.findById.mock.results[0].value;

            expect(Order.findById).toHaveBeenCalledWith('order123');
            expect(findByIdQueryMock.populate).toHaveBeenCalledTimes(2); // Expect two populate calls
            expect(findByIdQueryMock.populate.mock.calls[0]).toEqual(['user', 'firstName lastName email']);
            expect(findByIdQueryMock.populate.mock.calls[1]).toEqual([{ path: 'items.product', select: 'name blockchainItemId' }]);
            expect(order).toEqual(mockOrder); // Expecting the resolved value from exec
        });
    });

    describe('updateOrderStatus', () => {
        it('should update order status and blockchain item status', async () => {
            const updatedMockOrder = { ...mockOrder, status: 'shipped' };
            // Set up the findByIdAndUpdate mock to resolve to the updated mock order
            const updateQueryMock = createMockQuery(updatedMockOrder);
            Order.findByIdAndUpdate.mockReturnValue(updateQueryMock);
            
            blockchainService.updateItemStatusOnBlockchain.mockResolvedValue(true);

            const result = await orderService.updateOrderStatus('order123', 'shipped');

            expect(Order.findByIdAndUpdate).toHaveBeenCalledWith('order123', { status: 'shipped' }, { new: true, runValidators: true });
            expect(updateQueryMock.populate).toHaveBeenCalledTimes(1);
            expect(updateQueryMock.populate.mock.calls[0]).toEqual([{
                path: 'items.product',
                select: 'blockchainItemId'
            }]);
            expect(blockchainService.updateItemStatusOnBlockchain).toHaveBeenCalledWith(mockProductA.blockchainItemId, 'InTransit');
            expect(blockchainService.updateItemStatusOnBlockchain).toHaveBeenCalledWith(mockProductB.blockchainItemId, 'InTransit');
            expect(result.status).toBe('shipped');
        });

        it('should handle blockchain update failure gracefully', async () => {
            const updatedMockOrder = { ...mockOrder, status: 'delivered' };
            const updateQueryMock = createMockQuery(updatedMockOrder);
            Order.findByIdAndUpdate.mockReturnValue(updateQueryMock);
            
            blockchainService.updateItemStatusOnBlockchain.mockRejectedValue(new Error('Blockchain failed'));

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const result = await orderService.updateOrderStatus('order123', 'delivered');

            expect(updateQueryMock.populate).toHaveBeenCalledTimes(1);
            expect(updateQueryMock.populate.mock.calls[0]).toEqual([{
                path: 'items.product',
                select: 'blockchainItemId'
            }]);
            expect(blockchainService.updateItemStatusOnBlockchain).toHaveBeenCalledTimes(updatedMockOrder.items.length);
            expect(consoleErrorSpy).toHaveBeenCalled();
            expect(result.status).toBe('delivered');
            
            consoleErrorSpy.mockRestore();
        });

        it('should not update blockchain if status is invalid', async () => {
            const updatedMockOrder = { ...mockOrder, status: 'invalid' };
            const updateQueryMock = createMockQuery(updatedMockOrder);
            Order.findByIdAndUpdate.mockReturnValue(updateQueryMock);

            const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

            const result = await orderService.updateOrderStatus('order123', 'invalid');

            expect(updateQueryMock.populate).toHaveBeenCalledTimes(1);
            expect(updateQueryMock.populate.mock.calls[0]).toEqual([{
                path: 'items.product',
                select: 'blockchainItemId'
            }]);
            expect(blockchainService.updateItemStatusOnBlockchain).not.toHaveBeenCalled();
            expect(consoleWarnSpy).toHaveBeenCalledWith(
                `Unknown order status: invalid. Not updating blockchain.`
            );
            expect(result.status).toBe('invalid');

            consoleWarnSpy.mockRestore();
        });
    });
});
