// logger.js
const pino = require('pino');
const dotenv = require('dotenv');

dotenv.config();

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  timestamp: true,
  formatters: {
    pretty: ({ obj }) => JSON.stringify(obj, null, 2),
  },
});

module.exports = logger;
