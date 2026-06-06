// services/auth.service.js
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../utils/password.utils');

exports.registerUser = async (userData) => {
  try {
    // Check for duplicate email before proceeding
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('An account with this email already exists');
    }

    const hashedPassword = await hashPassword(userData.password);
    const newUser = new User({ ...userData, password: hashedPassword });
    await newUser.save();
    return newUser;
  } catch (error) {
    throw new Error(`Registration failed: ${error.message}`);
  }
};

exports.loginUser = async (credentials) => {
  try {
    const user = await User.findOne({ email: credentials.email });
    if (!user) throw new Error('Invalid username or password');

    // Check if user account is active
    if (user.status === 'inactive') {
      throw new Error('Account is deactivated. Contact an administrator.');
    }
    if (user.status === 'pending') {
      throw new Error('Account is pending approval. Please wait for admin activation.');
    }

    const isPasswordValid = await comparePassword(credentials.password, user.password);
    if (!isPasswordValid) throw new Error('Invalid username or password');

    // Generate JWT token with 24-hour expiry
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    return { ...user.toJSON(), token };
  } catch (error) {
    throw new Error(`Login failed: ${error}`);
  }
};

exports.resetPassword = async (email, newPassword) => {
  try {
    const hashedPassword = await hashPassword(newPassword);
    const updatedUser = await User.updateOne({ email }, { $set: { password: hashedPassword } });
    return updatedUser;
  } catch (error) {
    throw new Error(`Password reset failed: ${error}`);
  }
};