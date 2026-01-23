// middleware/role.middleware.js

/**
 * Middleware to check if a user has one of the required roles.
 * @param {string[]} allowedRoles - An array of roles that are allowed to access the route.
 */
exports.checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Forbidden - No role assigned' });
    }

    const hasRole = allowedRoles.some(role => req.user.role.includes(role));

    if (!hasRole) {
      return res.status(403).json({ message: 'Forbidden - Insufficient permissions' });
    }
    
    next();
  };
};