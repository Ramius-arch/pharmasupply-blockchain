const authService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/apiError');

exports.registerUser = catchAsync(async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  if (!firstName || !lastName || !email || !password) {
    throw new AppError('First name, last name, email, and password are required', 400);
  }
  const newUser = await authService.registerUser({ firstName, lastName, email, password, role });
  // Generate JWT token for the new user
  const result = await authService.loginUser({ email, password }); // Use loginUser service to get user + token
  
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