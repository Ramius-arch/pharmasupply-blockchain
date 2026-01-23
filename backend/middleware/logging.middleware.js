const logger = require('../utils/logger'); // Assuming you have a centralized logger

exports.requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log request details
  logger.info({
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    headers: req.headers,
    body: req.body,
  });
  
  res.on('finish', () => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Log response details
    logger.info({
      status: res.statusCode,
      duration: duration,
      url: req.originalUrl,
    });
  });
  
  next();
};
