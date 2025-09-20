// models/note.js
// Mongoose schema and model for Note
const mongoose = require('mongoose');


// Define the Note schema
const noteSchema = new mongoose.Schema({
// Define fields with validation
  title:       { type: String, required: true },
  content:     { type: String, required: true },
  author:      { type: String, required: true },
  tags:        { type: [String], default: [] },
  isImportant: { type: Boolean, default: false },
  createdAt:   { type: Date, default: Date.now },
  updatedAt:   { type: Date, default: Date.now },
  dueDate:     { type: Date },
  priority:    { type: String, enum: ['low','medium','high'], default: 'medium' }
});
// Export the model
module.exports = mongoose.model('Note', noteSchema, 'notes');
