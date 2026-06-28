const authService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/apiError');

exports.registerUser = catchAsync(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    throw new AppError('First name, last name, email, and password are required', 400);
  }
  await authService.registerUser({ firstName, lastName, email, password });
  // Log the user in to get a token
  const result = await authService.loginUser({ email, password });

  res.status(201).json({ message: 'User registered successfully', ...result });
});

exports.loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }
  const result = await authService.loginUser({ email, password });
  
  // result includes the user object and the token
  res.status(200).json({ message: 'Login successful', ...result });
});

exports.logoutUser = (req, res) => {
  // For a token-based system, logout is typically handled on the client-side
  // by deleting the token. The server can't really "invalidate" a JWT without a blacklist.
  res.status(200).json({ message: 'Logout successful. Please delete your token.' });
};

exports.forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new AppError('Email is required', 400);
  }

  const token = await authService.createPasswordResetToken(email);
  if (token) {
    // In production this should be sent via a secure email provider.
    // For now, log it so the feature can be tested without an email service.
    console.log(`Password reset token for ${email}: ${token}`);
  }

  // Always return the same message to avoid email enumeration
  res.status(200).json({ message: 'If an account exists, a reset link has been sent.' });
});

exports.resetPassword = catchAsync(async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    throw new AppError('Token and new password are required', 400);
  }

  await authService.resetPassword(token, newPassword);
  res.status(200).json({ message: 'Password reset successful. Please log in.' });
});