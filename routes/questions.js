

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Question = require('../models/Question');

// Create a new question (POST /api/questions)
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

// Get all questions (GET /api/questions)
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('categoryId')
      .populate('userId');
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single question by ID (GET /api/questions/:id)
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

// Get all questions in a specific category (GET /api/questions/category/:categoryId)
router.get('/category/:categoryId', async (req, res) => {
  try {
    const questions = await Question.find({ categoryId: req.params.categoryId })
      .populate('categoryId')
      .populate('userId');
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a question by ID (PUT /api/questions/:id)
router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    if (!updatedQuestion) return res.status(404).json({ error: 'Question not found' });
    res.json(updatedQuestion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a question by ID (DELETE /api/questions/:id)
router.delete('/:id', async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
    if (!deletedQuestion) return res.status(404).json({ error: 'Question not found' });
    res.json({ message: 'Question deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
