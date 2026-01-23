const env = require('./env');
const connectDB = require('./database');

// Load all configuration settings and make them available globally
module.exports = {
  ...env,
  connectToDatabase: () => connectDB(),
  // Add more global configurations as needed
};
