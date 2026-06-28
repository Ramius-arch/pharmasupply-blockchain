require('dotenv').config();

// Environment variables (loaded from .env file)
module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  HARDHAT_RPC_URL: process.env.HARDHAT_RPC_URL || 'http://127.0.0.1:8545',
  DEV_PRIVATE_KEY: process.env.DEV_PRIVATE_KEY,
  BLOCKCHAIN_CONTRACT_ADDRESS: process.env.BLOCKCHAIN_CONTRACT_ADDRESS,
  BLOCKCHAIN_CONTRACT_ABI: process.env.BLOCKCHAIN_CONTRACT_ABI,
  // Add more environment variables as needed
};
