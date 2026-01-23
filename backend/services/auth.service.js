// services/auth.service.js
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../utils/password.utils');

exports.registerUser = async (userData) => {
  try {
    const hashedPassword = await hashPassword(userData.password);
    const newUser = new User({ ...userData, password: hashedPassword });
    await newUser.save();
    return newUser;
  } catch (error) {
    throw new Error(`Registration failed: ${error}`);
  }
};

exports.loginUser = async (credentials) => {
  try {
    const user = await User.findOne({ email: credentials.email });
    if (!user) throw new Error('Invalid username or password');

    const isPasswordValid = await comparePassword(credentials.password, user.password);
    if (!isPasswordValid) throw new Error('Invalid username or password');

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);
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