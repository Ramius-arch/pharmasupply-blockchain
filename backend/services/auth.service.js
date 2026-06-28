// services/auth.service.js
const crypto = require('crypto');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const { hashPassword, comparePassword } = require('../utils/password.utils');

const RESET_TOKEN_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes

exports.registerUser = async (userData) => {
  try {
    // Check for duplicate email before proceeding
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('An account with this email already exists');
    }

    const hashedPassword = await hashPassword(userData.password);
    // Force role to 'user' — promotions are admin-only
    const newUser = new User({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: hashedPassword,
      role: 'user'
    });
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
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    // toJSON now excludes password
    return { ...user.toJSON(), token };
  } catch (error) {
    throw new Error(`Login failed: ${error}`);
  }
};

exports.createPasswordResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    // Do not reveal whether the email exists
    return null;
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);

  user.passwordResetToken = token;
  user.passwordResetExpires = expiresAt;
  await user.save();

  return token;
};

exports.resetPassword = async (token, newPassword) => {
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: new Date() }
  });

  if (!user) {
    throw new Error('Invalid or expired reset token');
  }

  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return user;
};