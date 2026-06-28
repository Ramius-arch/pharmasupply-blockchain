// frontend/src/api/blockchainService.js
import axios from 'axios';

const API_URL = '/api/blockchain';

// Function to create a new blockchain item
const createBlockchainItem = async (description, token) => {
  try {
    const response = await axios.post(`${API_URL}/item`, { description }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating blockchain item:', error);
    throw error;
  }
};

// Function to get details of a blockchain item
const getBlockchainItemDetails = async (itemId, token) => {
  try {
    const response = await axios.get(`${API_URL}/item/${itemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching blockchain item details:', error);
    throw error;
  }
};

// Function to update the status of a blockchain item
const updateBlockchainItemStatus = async (itemId, status, token) => {
  try {
    const response = await axios.put(`${API_URL}/item/${itemId}/status`, { status }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating blockchain item status:', error);
    throw error;
  }
};

// Function to get history of a blockchain item
const getBlockchainItemHistory = async (itemId, token) => {
  try {
    const response = await axios.get(`${API_URL}/item/${itemId}/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching blockchain item history:', error);
    throw error;
  }
};

// Function to get all blockchain transactions (events log)
const getTransactions = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching blockchain transactions:', error);
    throw error;
  }
};

export default {
  createBlockchainItem,
  getBlockchainItemDetails,
  updateBlockchainItemStatus,
  getBlockchainItemHistory,
  getTransactions,
};

