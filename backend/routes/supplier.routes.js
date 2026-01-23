const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplier.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');

// Public routes (assuming anyone can see suppliers)
router.get('/', supplierController.getAllSuppliers);
router.get('/:id', supplierController.getSupplierById);

// Admin-only routes
router.post(
    '/',
    authenticate,
    checkRole(['admin']),
    supplierController.createSupplier
);

router.put(
    '/:id',
    authenticate,
    checkRole(['admin']),
    supplierController.updateSupplier
);

router.delete(
    '/:id',
    authenticate,
    checkRole(['admin']),
    supplierController.deleteSupplier
);

module.exports = router;