const { getUserProfile, updateUserProfile, updateUserRole } = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/apiError');

exports.getUserProfile = catchAsync(async (req, res) => {
  // Admins or suppliers can get any profile by id, users can only get their own.
  const userId = req.params.userId || req.user.id;
  const user = await getUserProfile(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }
  res.status(200).json({ data: user });
});

exports.updateUserProfile = catchAsync(async (req, res) => {
  // Admins or suppliers can update any profile by id, users can only update their own.
  const userId = req.params.userId || req.user.id;
  const updates = req.body;

  const updatedUser = await updateUserProfile(userId, updates);
  if (!updatedUser) {
    throw new AppError('User not found', 404);
  }
  res.status(200).json({ message: 'Profile updated successfully', data: updatedUser });
});

exports.updateUserRole = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!role || !['admin', 'supplier', 'user'].includes(role)) {
    throw new AppError('A valid role is required', 400);
  }

  const updatedUser = await updateUserRole(userId, role);
  if (!updatedUser) {
    throw new AppError('User not found', 404);
  }
  res.status(200).json({ message: 'Role updated successfully', data: updatedUser });
});