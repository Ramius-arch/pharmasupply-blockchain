const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const path = require('path');

// Load configuration settings
const config = require('./config');

// Initialize Express app
const app = express();

// Security headers
app.use(helmet());

// Rate limiting — general API: 100 requests per 15 minutes per IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' }
});
app.use('/api', generalLimiter);

// Stricter rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts. Please try again later.' }
});
app.use('/api/auth', authLimiter);

// CORS: restrict to configured origin(s) in production
const corsOrigin = process.env.CORS_ORIGIN || (config.NODE_ENV === 'development' ? true : false);
app.use(cors({
  origin: corsOrigin,
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json({ limit: '10kb' })); // Limit body size to prevent abuse

// Serve static files (like images or documents)
app.use('/uploads', express.static('uploads'));

// Load API documentation from swagger.yaml
const swaggerDocument = yaml.load(path.join(__dirname, 'docs/swagger.yaml'));

// Use Swagger UI for interactive API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Database connection setup
config.connectToDatabase()
  .catch((err) => {
    console.error('Failed to connect to the database:', err);
    process.exit(1);
  });

// Define routes (import and mount them here)
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const supplierRoutes = require('./routes/supplier.routes');
const blockchainRoutes = require('./routes/blockchain.routes'); // Import blockchain routes
const walletRoutes = require('./routes/wallet.routes'); // Import wallet routes

// Use the routes with a base path (e.g., /api)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/blockchain', blockchainRoutes); // Mount blockchain routes
app.use('/api/wallet', walletRoutes); // Mount wallet routes
// Error handling middleware (must be defined after routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    message: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
});

// Start the server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    try {
      await mongoose.connection.close(false);
      console.log('MongoDB connection closed.');
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
