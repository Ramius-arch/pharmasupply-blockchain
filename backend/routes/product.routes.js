const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');
const { validate, createProductSchema } = require('../middleware/validation.middleware');

// Public routes - anyone can view products
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Protected routes - only admins or suppliers can modify products
router.post(
    '/',
    authenticate,
    checkRole(['admin', 'supplier']),
    validate(createProductSchema),
    productController.createProduct
);

router.put(
    '/:id',
    authenticate,
    checkRole(['admin', 'supplier']),
    productController.updateProduct
);

router.delete(
    '/:id',
    authenticate,
    checkRole(['admin', 'supplier']),
    productController.deleteProduct
);

module.exports = router;