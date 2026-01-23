const { generateWallet } = require('../../web3/utils'); // Adjust path as needed
const catchAsync = require('../utils/catchAsync');
const logger = require('../utils/logger'); // Assuming a logger utility exists

exports.generateWallet = catchAsync(async (req, res) => {
  const { address, privateKey } = generateWallet();
  
  // WARNING: Exposing private keys directly in API responses is highly insecure.
  // In a real application, private keys should be managed on the client-side
  // or secured with robust encryption and key management systems.
  logger.warn('A new wallet private key was generated and exposed via API for demonstration purposes.');

  res.status(200).json({
    status: 'success',
    data: {
      address,
      privateKey,
    },
  });
});
