const axios = require('axios');
const { faker } = require('@faker-js/faker');
const fs = require('fs');

const API_URL = 'http://localhost:3000/api';
const NUM_PRODUCTS = 13;

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

const createProduct = async (productData, token) => {
  try {
    const response = await axios.post(`${API_URL}/products`, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error.response ? error.response.data : error.message);
    throw new Error('Failed to create product');
  }
};

const createBlockchainItem = async (description, token) => {
    try {
      const response = await axios.post(`${API_URL}/blockchain/item`, { description }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating blockchain item:', error.response ? error.response.data : error.message);
      throw new Error('Failed to create blockchain item');
    }
};

const run = async () => {
  try {
    console.log('Authenticating...');
    const token = await authenticate();
    console.log('Authentication successful.');

    const createdProducts = [];

    for (let i = 0; i < NUM_PRODUCTS; i++) {
      console.log(`Creating product ${i + 1}/${NUM_PRODUCTS}...`);

      const description = faker.commerce.productDescription();

      // 1. Create blockchain item
      const blockchainResponse = await createBlockchainItem(description, token);
      const blockchainItemId = blockchainResponse.data.itemId;
      console.log(`  - Created blockchain item with ID: ${blockchainItemId}`);

      // 2. Create product
      const productData = {
        name: faker.commerce.productName(),
        description: description,
        unitPrice: parseFloat(faker.commerce.price()),
        category: faker.commerce.department(),
        manufacturer: faker.company.name(),
        quantityInStock: faker.number.int({ min: 10, max: 1000 }),
        dosageForm: faker.helpers.arrayElement(['Tablet', 'Capsule', 'Syrup', 'Injection']),
        strength: `${faker.number.int({ min: 1, max: 500 })}mg`,
        pharmaceuticalCode: faker.string.alphanumeric(10).toUpperCase(),
        blockchainItemId: blockchainItemId,
      };

      const createdProduct = await createProduct(productData, token);
      createdProducts.push(createdProduct.data);
      console.log(`  - Created product with ID: ${createdProduct.data._id}`);
    }

    fs.writeFileSync('products.json', JSON.stringify(createdProducts, null, 2));
    console.log(`\nSuccessfully created ${NUM_PRODUCTS} products. Data saved to products.json.`);

  } catch (error) {
    console.error('\nAn error occurred:', error.message);
  }
};

run();
