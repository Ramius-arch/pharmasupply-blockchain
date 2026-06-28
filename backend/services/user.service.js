// services/user.service.js
const User = require('../models/user.model');

exports.getUserProfile = async (userId) => {
  try {
    const user = await User.findById(userId).populate('role');
    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    throw new Error(`Failed to retrieve profile: ${error}`);
  }
};

exports.updateUserProfile = async (userId, userData) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, userData);
    if (!updatedUser) throw new Error('User not found');
    return updatedUser;
  } catch (error) {
    throw new Error(`Failed to update profile: ${error}`);
  }
};

exports.updateUserRole = async (userId, role) => {
  try {
    if (!['admin', 'supplier', 'user'].includes(role)) {
      throw new Error('Invalid role');
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    );
    if (!updatedUser) throw new Error('User not found');
    return updatedUser;
  } catch (error) {
    throw new Error(`Failed to update role: ${error}`);
  }
};
