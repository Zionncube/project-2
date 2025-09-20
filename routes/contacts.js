// routes/contacts.js
// Express router for Contact routes
const router = require('express').Router();
// Import validation functions from express-validator
const { body, param } = require('express-validator');
// Import the controller functions
const ctrl = require('../controllers/contacts');
// Import the request validation middleware
const validate = require('../middleware/validateRequest');

// Define routes with validation and controller handlers
router.get('/', ctrl.getAll);
// Get a single contact by ID
router.get('/:id', [param('id').isMongoId()], validate, ctrl.getOne);

// Create a new contact
// Update an existing contact
// Delete a contact

// Validation rules for creating and updating contacts
router.post('/',
    // Validation rules
  [
    body('firstName').isString().notEmpty(),
    body('lastName').isString().notEmpty(),
    body('email').isEmail(),
    body('favoriteColor').isString().notEmpty(),
    body('birthday').isISO8601()
  ],
  validate,
  ctrl.create
);


// Validation rules for updating a contact
router.put('/:id',
    // Validation rules
  [
    param('id').isMongoId(),
    body('email').optional().isEmail(),
    body('birthday').optional().isISO8601()
  ],
  validate,
  ctrl.update
);

// Delete a contact by ID
router.delete('/:id', [param('id').isMongoId()], validate, ctrl.remove);

// Export the router
module.exports = router;
