

// Load environment variables
require('dotenv').config();

// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//import required routes
const categoryRoutes = require('./routes/categories');
const questionRoutes = require('./routes/questions');
const answerRoutes = require('./routes/answers');
const userRoutes = require('./routes/users');


// Initialize the Express app
const app = express();

// Middleware
const cors = require('cors');

// Allow requests from your frontend origin
app.use(cors({
  origin: [
    'http://localhost:3000',                        // For local development
    'https://kevinfrayed-knot.github.io'            // Deployed frontend URL on GitHub Pages
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// MongoDB connection
const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic Route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Import auth routes
const authRoutes = require('./routes/auth');

// Use the auth routes
app.use('/api/auth', authRoutes);
// Use other routes
app.use('/api/categories', categoryRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/users', userRoutes);


// Set the port
const port = process.env.PORT || 8080;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
