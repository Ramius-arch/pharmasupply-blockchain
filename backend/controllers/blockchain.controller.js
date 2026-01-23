const blockchainService = require('../services/blockchain.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/apiError');

exports.createBlockchainItem = catchAsync(async (req, res, next) => {
    const { description } = req.body;
    if (!description) {
        return next(new AppError('Description is required to create a blockchain item', 400));
    }
    const newItemId = await blockchainService.createItemOnBlockchain(description);
    res.status(201).json({ data: { itemId: newItemId } });
});

exports.updateBlockchainItemStatus = catchAsync(async (req, res, next) => {
    const { itemId } = req.params;
    const { status } = req.body;
    if (!status) {
        return next(new AppError('New status is required for blockchain item update', 400));
    }
    await blockchainService.updateItemStatusOnBlockchain(itemId, status);
    res.status(200).json({ message: 'Blockchain item status updated successfully' });
});

exports.getBlockchainItemDetails = catchAsync(async (req, res, next) => {
    const { itemId } = req.params;
    const item = await blockchainService.getItemFromBlockchain(itemId);
    if (!item) {
        return next(new AppError('Blockchain item not found', 404));
    }
    res.status(200).json({ data: item });
});

exports.getBlockchainItemHistory = catchAsync(async (req, res, next) => {
    const { itemId } = req.params;
    const history = await blockchainService.getItemHistoryFromBlockchain(itemId);
    if (!history) {
        return next(new AppError('Blockchain item history not found', 404));
    }
    res.status(200).json({ data: history });
});

// New controller to get all blockchain transactions (events)
exports.getTransactions = catchAsync(async (req, res) => {
  const transactions = await blockchainService.getBlockchainTransactions();
  res.status(200).json({
    status: 'success',
    results: transactions.length,
    data: transactions,
  });
});

