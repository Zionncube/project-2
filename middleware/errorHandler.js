// middleware/errorHandler.js
// Centralized error handling middleware
module.exports = (err, req, res, next) => {
    // Log the error for debugging
  console.error(err);
  // If headers are already sent, delegate to the default Express error handler
  if (res.headersSent) return next(err);
  // Set the status code and send a JSON response with the error message
  const status = err.statusCode || 500;
  // Send JSON response
  res.status(status).json({
    // Include any additional error details
    success: false,
    // Send the error message
    message: err.message || 'Internal Server Error'
  });
};
