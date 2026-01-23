const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
// const { authenticate } = require('../middleware/auth.middleware');

// Public routes
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser); // Logout doesn't strictly need to be protected

// TODO: Implement the following routes and controllers
// router.get('/refresh', authenticate, authController.refreshToken);
// router.post('/forgot-password', authController.forgotPassword);
// router.get('/verify-reset-token/:token', authController.verifyResetToken);
// router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;