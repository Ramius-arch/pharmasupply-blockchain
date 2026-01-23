const mongoose = require('mongoose');

// Function to connect to MongoDB database
const connectDB = async () => {
  try {
    // The deprecated options are no longer needed in Mongoose 6+
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Connected to MongoDB successfully!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with an error code
  }
};

module.exports = connectDB;