

const express = require('express');
const Answer = require('../models/Answer');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to verify token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Create a new answer (POST /api/answers)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { questionId, content } = req.body;
    const userId = req.user.id; // Extract userId from token

    // Create the new answer
    const answer = new Answer({ questionId, userId, content });
    const savedAnswer = await answer.save();

    res.status(201).json(savedAnswer);
  } catch (err) {
    console.error('Error creating answer:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all answers (GET /api/answers)
router.get('/', async (req, res) => {
  try {
    const answers = await Answer.find()
      .populate('questionId')
      .populate('userId');
    res.json(answers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all answers for a specific question (GET /api/answers/:questionId)
router.get('/:questionId', async (req, res) => {
  try {
    const answers = await Answer.find({ questionId: req.params.questionId })
      .populate('userId');
    res.json(answers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an answer by ID (PUT /api/answers/:id)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const updatedAnswer = await Answer.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true }
    );
    if (!updatedAnswer) return res.status(404).json({ message: 'Answer not found' });
    res.json(updatedAnswer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an answer by ID (DELETE /api/answers/:id)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedAnswer = await Answer.findByIdAndDelete(req.params.id);
    if (!deletedAnswer) return res.status(404).json({ message: 'Answer not found' });
    res.json({ message: 'Answer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
