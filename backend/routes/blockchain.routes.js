const express = require('express');
const router = express.Router();
const blockchainController = require('../controllers/blockchain.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Route to create a new item on the blockchain
router.post('/item', authenticate, blockchainController.createBlockchainItem);

// Route to get a single item's details from the blockchain
router.get('/item/:itemId', authenticate, blockchainController.getBlockchainItemDetails);

// Route to update an item's status on the blockchain
router.put('/item/:itemId/status', authenticate, blockchainController.updateBlockchainItemStatus);

// Route to get an item's status history from the blockchain
router.get('/item/:itemId/history', authenticate, blockchainController.getBlockchainItemHistory);

// New route to get all blockchain transactions (events)
router.get('/transactions', authenticate, blockchainController.getTransactions);

module.exports = router;
