// controllers/contacts.js
const Contact = require('../models/contact');

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: API to manage contacts
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Contact:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 64ffbe1f8f1c2a00123abcd5
 *         firstName:
 *           type: string
 *           example: Happiness
 *         lastName:
 *           type: string
 *           example: Ncube
 *         email:
 *           type: string
 *           format: email
 *           example: happy@example.com
 *         favoriteColor:
 *           type: string
 *           example: Blue
 *         birthday:
 *           type: string
 *           format: date
 *           example: 2000-01-01
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
 * /api/contacts:
 *   get:
 *     summary: Get all contacts
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of contacts
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
 *                     $ref: '#/components/schemas/Contact'
 */
exports.getAll = async (req, res, next) => {
  try {
    const items = await Contact.find();
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/contacts/{id}:
 *   get:
 *     summary: Get a contact by ID
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Contact retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Contact not found
 */
exports.getOne = async (req, res, next) => {
  try {
    const item = await Contact.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       201:
 *         description: Contact created successfully
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
 *                   example: 64ffbe1f8f1c2a00123abcd5
 *                 data:
 *                   $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Invalid input
 */
exports.create = async (req, res, next) => {
  try {
    const c = new Contact(req.body);
    const saved = await c.save();
    res.status(201).json({ success: true, id: saved._id, data: saved });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/contacts/{id}:
 *   put:
 *     summary: Update an existing contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Contact not found
 */
exports.update = async (req, res, next) => {
  try {
    req.body.updatedAt = new Date();
    const updated = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     summary: Delete a contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *       404:
 *         description: Contact not found
 */
exports.remove = async (req, res, next) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
