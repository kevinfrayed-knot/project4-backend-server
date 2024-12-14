

const express = require('express');
const Answer = require('../models/Answer');
const router = express.Router();

// Create a new answer
router.post('/', async (req, res) => {
  try {
    const { questionId, userId, content } = req.body;
    const answer = new Answer({ questionId, userId, content });
    await answer.save();
    res.status(201).json(answer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all answers
router.get('/', async (req, res) => {
  try {
    const answers = await Answer.find().populate('questionId').populate('userId');
    res.json(answers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get all answers for a question
router.get('/:questionId', async (req, res) => {
  try {
    const answers = await Answer.find({ questionId: req.params.questionId }).populate('userId');
    res.json(answers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an answer by ID
router.put('/:id', async (req, res) => {
  try {
    const { content } = req.body;
    const updatedAnswer = await Answer.findByIdAndUpdate(req.params.id, { content }, { new: true });
    if (!updatedAnswer) return res.status(404).json({ message: 'Answer not found' });
    res.json(updatedAnswer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an answer by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedAnswer = await Answer.findByIdAndDelete(req.params.id);
    if (!deletedAnswer) return res.status(404).json({ message: 'Answer not found' });
    res.json({ message: 'Answer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
