const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },    // Firebase UID
  recipient: { type: String, required: true }, // Firebase UID
  content: { type: String, required: true },
}, { timestamps: true, collection: 'chat_messages' });

module.exports = mongoose.model('Message', MessageSchema); 