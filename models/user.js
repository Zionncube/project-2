// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  provider: { type: String },        // e.g. 'google'
  providerId: { type: String },      // google id
  displayName: { type: String },
  email: { type: String },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema, 'users');
// Note: Ensure to create the 'users' collection in MongoDB if it doesn't exist.