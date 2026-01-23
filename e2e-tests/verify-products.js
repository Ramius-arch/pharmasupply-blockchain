const axios = require('axios');
const fs = require('fs');

const API_URL = 'http://localhost:3000/api';

const authenticate = async () => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@example.com',
      password: 'password123',
    });
    return response.data.token;
  } catch (error) {
    console.error('Error authenticating:', error.response ? error.response.data : error.message);
    throw new Error('Failed to authenticate');
  }
};

const getProduct = async (productId, token) => {
  try {
    const response = await axios.get(`${API_URL}/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error getting product ${productId}:`, error.response ? error.response.data : error.message);
    throw new Error(`Failed to get product ${productId}`);
  }
};

const getBlockchainItem = async (blockchainItemId, token) => {
    try {
        const response = await axios.get(`${API_URL}/blockchain/item/${blockchainItemId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error getting blockchain item ${blockchainItemId}:`, error.response ? error.response.data : error.message);
        throw new Error(`Failed to get blockchain item ${blockchainItemId}`);
    }
};

const run = async () => {
  try {
    console.log('Authenticating...');
    const token = await authenticate();
    console.log('Authentication successful.');

    const productsToVerify = JSON.parse(fs.readFileSync('products.json', 'utf-8'));
    console.log(`Verifying ${productsToVerify.length} products...`);

    let allVerified = true;

    for (const product of productsToVerify) {
      console.log(`
Verifying product with ID: ${product._id}`);
      
      // Verify product data
      const retrievedProduct = await getProduct(product._id, token);
      if (retrievedProduct.data.name !== product.name) {
        console.error(`  - Product name mismatch for ID ${product._id}`);
        allVerified = false;
      } else {
        console.log(`  - Product data verified.`);
      }

      // Verify blockchain data
      const retrievedBlockchainItem = await getBlockchainItem(product.blockchainItemId, token);
      if (retrievedBlockchainItem.data.id !== product.blockchainItemId) {
        console.error(`  - Blockchain item ID mismatch for product ID ${product._id}`);
        allVerified = false;
      } else {
        console.log(`  - Blockchain data verified.`);
      }
    }

    if (allVerified) {
      console.log('\nAll products and blockchain items verified successfully!');
    } else {
      console.error('\nSome verifications failed.');
    }

  } catch (error) {
    console.error('\nAn error occurred:', error.message);
  }
};

run();
