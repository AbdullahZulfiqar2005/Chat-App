const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

// Upsert user (called from frontend after login)
router.post('/sync', async (req, res) => {
  const { uid, email, displayName } = req.body;
  if (!uid || !email) return res.status(400).json({ message: 'Missing uid or email' });
  try {
    let user = await User.findOne({ uid });
    if (!user) {
      user = new User({ uid, email, displayName });
      await user.save();
    }
    res.json({ message: 'User synced', user });
  } catch (err) {
    console.error('SYNC ERROR:', err); // <-- Add this line
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users except self
router.get('/', async (req, res) => {
  const { uid } = req.query;
  try {
    const users = await User.find({ uid: { $ne: uid } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 