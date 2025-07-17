const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // Firebase UID
  email: { type: String, required: true, unique: true },
  displayName: { type: String }, // User-friendly name
  // Add other fields as needed (e.g., displayName)
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema); 