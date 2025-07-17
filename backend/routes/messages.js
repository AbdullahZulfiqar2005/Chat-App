const express = require('express');
const jwt = require('jsonwebtoken');
const Message = require('../models/Message');

const router = express.Router();

// JWT middleware
function auth(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

// Get messages between two users
router.get('/:userId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user.id },
      ],
    }).sort('createdAt');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Post a new message
router.post('/', auth, async (req, res) => {
  try {
    const { recipient, content } = req.body;
    const message = new Message({ sender: req.user.id, recipient, content });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 