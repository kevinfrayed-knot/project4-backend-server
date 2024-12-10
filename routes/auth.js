const express = require('express');
const router = express.Router();

// User registration route
router.post('/register', (req, res) => {
  console.log('Register route hit');
  res.json({ message: 'User registered successfully' });
});
console.log('Auth routes file loaded');

router.post('/register', (req, res) => {
  console.log('Register route hit');
  res.json({ message: 'User registered successfully' });
});

module.exports = router;
