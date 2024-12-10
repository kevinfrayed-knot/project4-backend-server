// Load environment variables
require('dotenv').config();

// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize the Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic Route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Set the port
const port = process.env.PORT || 8080;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Test MongoDB connection with a simple GET route
app.get('/test-db', async (req, res) => {
    try {
      await mongoose.connection.db.admin().ping();
      res.send('MongoDB connection is active!');
    } catch (err) {
      res.status(500).send('MongoDB connection failed: ' + err.message);
    }
  });

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
console.log('Auth routes loaded');
console.log('Server is running on port 8080');

  