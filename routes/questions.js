const express = require('express');
const Question = require('../models/Question');

const router = express.Router();

// Create a new question
router.post('/', async (req, res) => {
  try {
    const { categoryId, userId, content } = req.body;
    const question = new Question({ categoryId, userId, content });
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all questions by category
router.get('/:categoryId', async (req, res) => {
  try {
    const questions = await Question.find({ categoryId: req.params.categoryId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
