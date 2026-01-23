const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const path = require('path');

// Add this to handle BigInt serialization globally
BigInt.prototype.toJSON = function() { return this.toString(); };

// Load configuration settings
const config = require('./config');

// Initialize Express app
const app = express();

// Enable CORS for all routes (for development only)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

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
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
