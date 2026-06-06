const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validate, registerSchema, loginSchema } = require('../middleware/validation.middleware');

// Public routes — with input validation
router.post('/register', validate(registerSchema), authController.registerUser);
router.post('/login', validate(loginSchema), authController.loginUser);
router.post('/logout', authController.logoutUser);

module.exports = router;