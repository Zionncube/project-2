// middleware/validateRequest.js
// Middleware to validate request using express-validator
const { validationResult } = require('express-validator');

// Middleware function to check for validation errors
module.exports = function (req, res, next) {
    // Find the validation errors in this request and wrap them in an object
  const errors = validationResult(req);
  // If there are errors, respond with 400 and the error details
  if (!errors.isEmpty()) {
    // Log the errors for debugging
    return res.status(400).json({ success:false, errors: errors.array() });
  }
  // If no errors, proceed to the next middleware or route handler
  next();
};
