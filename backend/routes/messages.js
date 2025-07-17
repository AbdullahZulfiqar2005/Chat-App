const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

// Get messages between two users
router.get('/:userUid', async (req, res) => {
  const { uid } = req.query; // current user's uid
  try {
    const messages = await Message.find({
      $or: [
        { sender: uid, recipient: req.params.userUid },
        { sender: req.params.userUid, recipient: uid },
      ],
    }).sort('createdAt');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Post a new message
router.post('/', async (req, res) => {
  try {
    const { sender, recipient, content } = req.body;
    const message = new Message({ sender, recipient, content });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 