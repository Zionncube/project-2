// controllers/notes.js
const Note = require('../models/note');

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: API to manage notes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 64ffbe1f8f1c2a00123abcd4
 *         title:
 *           type: string
 *           example: Project Plan
 *         content:
 *           type: string
 *           example: Make API for W03
 *         author:
 *           type: string
 *           example: You
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["project","w03"]
 *         isImportant:
 *           type: boolean
 *           example: true
 *         dueDate:
 *           type: string
 *           format: date
 *           example: 2025-12-31
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           example: high
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-09-20T14:00:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-09-20T15:00:00Z
 */

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all notes
 *     tags: [Notes]
 *     responses:
 *       200:
 *         description: List of notes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 */
exports.getAll = async (req, res, next) => {
  try {
    const items = await Note.find();
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Get a note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Note'
 *       404:
 *         description: Note not found
 */
exports.getOne = async (req, res, next) => {
  try {
    const doc = await Note.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Note not found' });
    res.json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Note'
 *     responses:
 *       201:
 *         description: Note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 id:
 *                   type: string
 *                   example: 64ffbe1f8f1c2a00123abcd4
 *                 data:
 *                   $ref: '#/components/schemas/Note'
 *       400:
 *         description: Invalid input
 */
exports.create = async (req, res, next) => {
  try {
    const n = new Note(req.body);
    const saved = await n.save();
    res.status(201).json({ success: true, id: saved._id, data: saved });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Update an existing note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Note'
 *     responses:
 *       200:
 *         description: Note updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Note not found
 */
exports.update = async (req, res, next) => {
  try {
    req.body.updatedAt = new Date();
    const updated = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ success: false, message: 'Note not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *       404:
 *         description: Note not found
 */
exports.remove = async (req, res, next) => {
  try {
    const deleted = await Note.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Note not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
