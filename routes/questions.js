

const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// Create a new question (POST /api/questions)
router.post('/', async (req, res) => {
  try {
    console.log(req.body);
    const question = new Question({
      categoryId: req.body.categoryId,
      userId: req.body.userId,
      content: req.body.content,
    });
    const savedQuestion = await question.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error(error);
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
