

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); // <-- Add this import
const Question = require('../models/Question');

// Create a new question (POST /api/questions)
router.post('/', async (req, res) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify and decode the token to get the userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Debugging line to log the incoming request body and userId
    console.log('Request Body:', req.body);
    console.log('Decoded User ID:', userId);

    // Extract categoryId and content from the request body
    const { categoryId, content } = req.body;

    // Create a new Question with the userId
    const question = new Question({
      categoryId,
      userId,
      content,
    });

    // Save the new question
    const savedQuestion = await question.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all questions in a specific category (GET /api/questions/category/:categoryId)
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    console.log('Category ID:', categoryId); // Debug log to verify categoryId

    // Validate categoryId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      console.error('Invalid category ID:', categoryId); // Debug log for invalid ID
      return res.status(400).json({ error: 'Invalid category ID' });
    }

    // Fetch questions and populate 'userId' with 'username'
    const questions = await Question.find({ categoryId }).populate('userId', 'username');
    console.log('Questions found:', questions); // Debug log for fetched questions

    res.json(questions);
  } catch (err) {
    console.error('Error fetching questions by category:', err);
    res.status(500).json({ error: err.message });
  }
});

//get question details for a secific question 
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('categoryId')
      .populate('userId');
    if (!question) return res.status(404).json({ error: 'Question not found' });
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

