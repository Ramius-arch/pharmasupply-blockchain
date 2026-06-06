import axios from 'axios';

const API_URL = '/api/orders';

const createOrder = async (orderData, token) => {
  try {
    const response = await axios.post(API_URL, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

const getMyOrders = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/my-orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching my orders:', error);
    throw error;
  }
};

const getAllOrders = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
};

const updateOrderStatus = async (orderId, status, token) => {
  try {
    const response = await axios.put(`${API_URL}/${orderId}/status`, { status }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating order ${orderId} status:`, error);
    throw error;
  }
};

export default {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
};
