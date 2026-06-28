const catchAsync = require('../utils/catchAsync');

exports.generateWallet = catchAsync(async (req, res) => {
  // Private keys must never be generated or handled by the server.
  // The frontend should generate wallets locally using ethers.js or similar.
  res.status(410).json({
    status: 'error',
    message: 'Server-side wallet generation has been disabled for security. Generate wallets in the client.'
  });
});
