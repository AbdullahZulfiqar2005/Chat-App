const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const router = express.Router();

// Email transporter (for development, use Ethereal)
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: process.env.ETHEREAL_USER,
    pass: process.env.ETHEREAL_PASS,
  },
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = new User({ username, email, password: hashedPassword, verificationToken, verified: false });
    await user.save();
    // Send verification email
    const verifyUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/api/auth/verify?token=${verificationToken}`;
    await transporter.sendMail({
      from: 'no-reply@globalchat.com',
      to: email,
      subject: 'Verify your email',
      html: `<p>Hi ${username},</p><p>Please verify your email by clicking the link below:</p><a href="${verifyUrl}">${verifyUrl}</a>`
    });
    res.status(201).json({ message: 'User registered successfully. Please check your email to verify your account.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Email verification route
router.get('/verify', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: 'Invalid or missing token' });
    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
    user.verified = true;
    user.verificationToken = undefined;
    await user.save();
    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (!user.verified) return res.status(403).json({ message: 'Please verify your email before logging in.' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 