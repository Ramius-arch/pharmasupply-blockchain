const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');

// A route for a user to get their own profile
router.get(
    '/profile',
    authenticate,
    userController.getUserProfile
);

// A route for a user to update their own profile
router.put(
    '/profile',
    authenticate,
    userController.updateUserProfile
);

// A route for an admin or supplier to get any user's profile by their ID
router.get(
    '/:userId',
    authenticate,
    checkRole(['admin', 'supplier']),
    userController.getUserProfile
);

// A route for an admin or supplier to update any user's profile by their ID
router.put(
    '/:userId',
    authenticate,
    checkRole(['admin', 'supplier']),
    userController.updateUserProfile
);


module.exports = router;