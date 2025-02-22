const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Function to validate and log MONGODB_URI with fallback
const validateMongoURI = () => {
  const mongoURI = process.env.MONGODB_URI || '';
  if (!mongoURI || typeof mongoURI !== 'string') {
    throw new Error('MONGODB_URI is not defined or is not a string. Check your .env file or set it as an environment variable.');
  }
  console.log('MONGODB_URI:', mongoURI); // Log to verify
  return mongoURI;
};

// Connect to MongoDB Atlas with enhanced error handling
try {
  const mongoURI = validateMongoURI();
  mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 5000, // Add timeout for better error handling
    connectTimeoutMS: 10000 // Add connection timeout
  }).then(() => {
    console.log('Connected to MongoDB Atlas');
  }).catch(err => {
    console.error('MongoDB Atlas connection error:', err);
    process.exit(1); // Exit if connection fails
  });
} catch (error) {
  console.error('Error validating MongoDB URI:', error.message);
  process.exit(1); // Exit if URI validation fails
}

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Routes
app.use('/api', require('./routes/surveyRoutes'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});