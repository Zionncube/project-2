// models/contact.js
// Mongoose schema and model for Contact
const mongoose = require('mongoose');


// Define the Contact schema
const contactSchema = new mongoose.Schema({
// Define fields with validation
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  email:     { type: String, required: true, trim: true, lowercase: true },
  favoriteColor: { type: String, required: true, trim: true },
  birthday:  { type: Date, required: true }
  // Enable timestamps for createdAt and updatedAt
}, { timestamps: true });

// Export the model
module.exports = mongoose.model('Contact', contactSchema, 'contacts');
