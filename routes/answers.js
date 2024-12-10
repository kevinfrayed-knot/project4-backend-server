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

// Get all answers for a question
router.get('/:questionId', async (req, res) => {
  try {
    const answers = await Answer.find({ questionId: req.params.questionId });
    res.json(answers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
