

const express = require('express');
const Question = require('../models/Question');
const router = express.Router();

// Create a new question
router.post('/', async (req, res) => {
  try {
    const { title, content, categoryId } = req.body;
    const question = new Question({ title, content, categoryId });
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find().populate('categoryId');
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a question by ID
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('categoryId');
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a question by ID
router.put('/:id', async (req, res) => {
  try {
    const { title, content, categoryId } = req.body;
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      { title, content, categoryId },
      { new: true }
    );
    if (!updatedQuestion) return res.status(404).json({ message: 'Question not found' });
    res.json(updatedQuestion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a question by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
    if (!deletedQuestion) return res.status(404).json({ message: 'Question not found' });
    res.json({ message: 'Question deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
