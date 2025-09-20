// server.js
// Main server file
// Load environment variables from .env file
require('dotenv').config();// Load .env
// Import dependencies
//
const express = require('express');
// Mongoose for MongoDB
const mongoose = require('mongoose');
// Swagger UI for API documentation
const swaggerUi = require('swagger-ui-express');
// Import custom modules
const swaggerSpec = require('./swagger');
// Routes
//contacts routes
const contactsRoutes = require('./routes/contacts');
//notes routes
const notesRoutes = require('./routes/notes');
// Error handler middleware
const errorHandler = require('./middleware/errorHandler');

// Initialize Express app
const app = express();
// Middleware to parse JSON request bodies
app.use(express.json());

// Swagger UI
// Serve Swagger docs at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
// Use the imported routes for contacts and notes
app.use('/api/contacts', contactsRoutes);
app.use('/api/notes', notesRoutes);

// health
// Simple health check endpoint
app.get('/', (req, res) => res.json({ ok:true }));

// Error handler (last middleware)
app.use(errorHandler);

// Connect & start
// Connect to MongoDB and start the server
const MONGO_URI = process.env.MONGO_URI;
// Ensure MONGO_URI is set
if(!MONGO_URI) {
    // Log error and exit if MONGO_URI is not set
  console.error('MONGO_URI not set. Create .env from .env.example');
  // Create .env file from .env.example
  process.exit(1);
}
// Connect to MongoDB
mongoose.connect(MONGO_URI)
// Start server after successful DB connection
  .then(() => {
    // Start the server
    const port = process.env.PORT || 8080;
    // Listen on the specified port
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
// Handle connection errors
  .catch(err => {
    // Log connection error and exit
    console.error('Mongo connect error', err);
    // Exit the process with failure
    process.exit(1);
  });
