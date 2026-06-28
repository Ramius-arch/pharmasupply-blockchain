// frontend/src/api/productService.js
import axios from 'axios';

const API_URL = '/api/products'; // Base URL for product API

// Helper function for retrying API calls.
// IMPORTANT: Only retries on network errors or server-side 5xx failures.
// Never retries client-side 4xx errors (Bad Request, Not Found, Unauthorized, etc.)
const retry = async (fn, retriesLeft = 3, interval = 1000) => {
  try {
    return await fn();
  } catch (error) {
    const status = error?.response?.status;
    // Do not retry if the server returned a 4xx response
    if (status && status >= 400 && status < 500) {
      throw error;
    }
    if (retriesLeft > 0) {
      console.warn(`Retrying in ${interval / 1000}s... (${retriesLeft} retries left)`);
      await new Promise(resolve => setTimeout(resolve, interval));
      return retry(fn, retriesLeft - 1, interval * 2); // exponential back-off
    }
    throw error;
  }
};


// Function to fetch all products
const getAllProducts = async () => {
  try {
    // Wrap the axios call in the retry function
    const response = await retry(async () => {
      console.log('Attempting to fetch all products...'); // Add a log for clarity
      return await axios.get(API_URL);
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error;
  }
};

// Function to fetch a single product by ID
const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

// Function to create a new product
const createProduct = async (productData, token) => {
  try {
    const response = await axios.post(API_URL, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
};
