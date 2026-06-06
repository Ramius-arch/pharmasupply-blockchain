import axios from 'axios';

const API_URL = '/api/users';

const getAllUsers = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

const getUserProfile = async (userId, token) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

const updateUserProfile = async (userId, userData, token) => {
  try {
    const response = await axios.put(`${API_URL}/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export default {
  getAllUsers,
  getUserProfile,
  updateUserProfile
};
