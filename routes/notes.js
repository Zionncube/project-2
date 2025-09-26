// routes/notes.js
// Express router for Note routes
const router = require('express').Router();
// Import validation functions from express-validator
const { body, param } = require('express-validator');
// Import the controller functions
const ctrl = require('../controllers/notes');
// Import the request validation middleware
const validate = require('../middleware/validateRequest');
// Import JWT verification middleware
const verifyToken = require('../middleware/verifyToken');

// Apply verifyToken globally to all routes in this router
router.use(verifyToken);

// Define routes with validation and controller handlers
router.get('/', ctrl.getAll);
// Get a single note by ID
router.get('/:id', [param('id').isMongoId()], validate, ctrl.getOne);

// Create a new note
router.post(
  '/',
  [
    body('title').isString().notEmpty(),
    body('content').isString().notEmpty(),
    body('author').isString().notEmpty(),
    body('tags').optional().isArray(),
    body('isImportant').optional().isBoolean(),
    body('dueDate').optional().isISO8601(),
    body('priority').optional().isIn(['low','medium','high'])
  ],
  validate,
  ctrl.create
);

// Validation rules for updating a note
router.put(
  '/:id',
  [
    param('id').isMongoId(),
    body('dueDate').optional().isISO8601(),
    body('priority').optional().isIn(['low','medium','high'])
  ],
  validate,
  ctrl.update
);

// Delete a note by ID
router.delete('/:id', [param('id').isMongoId()], validate, ctrl.remove);

// Export the router
module.exports = router;
