// swagger.js
// Swagger setup for API documentation
// Import swagger-jsdoc
const swaggerJsdoc = require('swagger-jsdoc');

// Swagger definition and options
const options = {
    // Swagger
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Project2 CRUD API',
      version: '1.0.0',
      description: 'Contacts + Notes CRUD API'
    },
    // Define the server URL dynamically based on environment variables
    servers: [
        // Production server
      { url: process.env.RENDER_URL || `http://localhost:${process.env.PORT || 8080}` }
    ]
  },
    // Paths to the API docs
 apis: ['./controllers/*.js'], // you can also include './server.js' comments
};

// Initialize swagger-jsdoc
module.exports = swaggerJsdoc(options);
