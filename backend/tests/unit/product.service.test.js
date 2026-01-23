const productService = require('../../services/product.service');
const Product = require('../../models/product.model');
const blockchainService = require('../../services/blockchain.service');

// Mock external modules
jest.mock('../../models/product.model');
jest.mock('../../services/blockchain.service');

describe('Product Service', () => {
    let productInstance; // To hold the mock instance of Product

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock the Product constructor to return a new instance each time
        // This instance will have a save method that resolves to itself,
        // allowing properties set during the service call to persist.
        Product.mockImplementation(function(data) {
            // Assign initial data
            Object.assign(this, data);
            this._id = this._id || 'mockProductId'; // Give it an ID
            this.blockchainItemId = undefined; // Ensure it starts undefined

            this.save = jest.fn().mockResolvedValue(this); // save resolves with the instance itself
            this.toObject = jest.fn().mockReturnValue({ ...this }); // toObject returns a plain copy
        });

        // Mock static methods
        Product.find = jest.fn();
        Product.findById = jest.fn();
        Product.findByIdAndUpdate = jest.fn();
        Product.findByIdAndDelete = jest.fn();
    });

    describe('createProduct', () => {
        it('should create a product and a blockchain item', async () => {
            const productData = { name: 'Test Product', description: 'A test product', unitPrice: 100 };
            const blockchainItemMockId = '1';
            blockchainService.createItemOnBlockchain.mockResolvedValue(blockchainItemMockId);

            const createdProduct = await productService.createProduct(productData);

            // Expect Product constructor to be called with initial data
            expect(Product).toHaveBeenCalledWith(expect.objectContaining(productData));
            // Expect blockchainService to be called
            expect(blockchainService.createItemOnBlockchain).toHaveBeenCalledWith(productData.name);
            // Expect blockchainItemId to be set on the returned product instance
            expect(createdProduct.blockchainItemId).toBe(blockchainItemMockId);
            // Expect save to be called
            expect(createdProduct.save).toHaveBeenCalledTimes(1);
            // Expect the returned product to have the correct properties
            expect(createdProduct.name).toBe(productData.name);
            expect(createdProduct._id).toBe('mockProductId');
        });

        it('should create a product even if blockchain item creation fails', async () => {
            const productData = { name: 'Product without Blockchain', description: 'Desc', unitPrice: 50 };
            blockchainService.createItemOnBlockchain.mockRejectedValue(new Error('Blockchain error'));
            
            // Mock console.error to prevent it from cluttering test output and to check it was called
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const createdProduct = await productService.createProduct(productData);

            expect(Product).toHaveBeenCalledWith(expect.objectContaining(productData));
            expect(blockchainService.createItemOnBlockchain).toHaveBeenCalledWith(productData.name);
            // blockchainItemId should NOT be set if blockchain call fails
            expect(createdProduct.blockchainItemId).toBeUndefined();
            expect(createdProduct.save).toHaveBeenCalledTimes(1);
            expect(createdProduct.name).toBe(productData.name);
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "Failed to create blockchain item for product:",
                expect.any(Error)
            );
            consoleErrorSpy.mockRestore(); // Restore original console.error
        });
    });

    describe('getAllProducts', () => {
        it('should return all products', async () => {
            const productsList = [
                { _id: 'p1', name: 'Product 1', unitPrice: 10 },
                { _id: 'p2', name: 'Product 2', unitPrice: 20 },
            ];
            Product.find.mockResolvedValue(productsList);
            const result = await productService.getAllProducts({});
            expect(Product.find).toHaveBeenCalledWith({});
            expect(result).toEqual(productsList);
        });
    });

    describe('getProductById', () => {
        it('should return a product by ID', async () => {
            const productById = { _id: 'prod123', name: 'Test Product', unitPrice: 100 };
            Product.findById.mockResolvedValue(productById);
            const result = await productService.getProductById('prod123');
            expect(Product.findById).toHaveBeenCalledWith('prod123');
            expect(result).toEqual(productById);
        });

        it('should return null if product not found', async () => {
            Product.findById.mockResolvedValue(null);
            const result = await productService.getProductById('nonexistent');
            expect(Product.findById).toHaveBeenCalledWith('nonexistent');
            expect(result).toBeNull();
        });
    });

    describe('updateProduct', () => {
        it('should update and return the product', async () => {
            const updatedProduct = { _id: 'prod123', name: 'Updated Product', unitPrice: 110 };
            Product.findByIdAndUpdate.mockResolvedValue(updatedProduct);
            const result = await productService.updateProduct('prod123', { name: 'Updated Product' });
            expect(Product.findByIdAndUpdate).toHaveBeenCalledWith('prod123', { name: 'Updated Product' }, { new: true, runValidators: true });
            expect(result).toEqual(updatedProduct);
        });
    });

    describe('deleteProduct', () => {
        it('should delete and return the product', async () => {
            const deletedProduct = { _id: 'prod123', name: 'Deleted Product', unitPrice: 90 };
            Product.findByIdAndDelete.mockResolvedValue(deletedProduct);
            const result = await productService.deleteProduct('prod123');
            expect(Product.findByIdAndDelete).toHaveBeenCalledWith('prod123');
            expect(result).toEqual(deletedProduct);
        });
    });
});
