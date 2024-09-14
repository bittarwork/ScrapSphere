const express = require('express');
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */
const router = express.Router();
const {
    createUser,
    updateUser,
    deleteUser,
    getAllUsers,
    getUserById
} = require('../controllers/userController');

const { protect, authorize } = require('../middlewares/authMiddleware');




/**
 * @swagger
 * /api/users/create:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 example: buyer
 *               phone:
 *                 type: string
 *                 example: +1234567890
 *               address:
 *                 type: object
 *                 properties:
 *                   country:
 *                     type: string
 *                     example: USA
 *                   city:
 *                     type: string
 *                     example: New York
 *                   neighborhood:
 *                     type: string
 *                     example: Brooklyn
 *                   buildingNumber:
 *                     type: string
 *                     example: 123
 *                   apartmentNumber:
 *                     type: string
 *                     example: 456
 *                   additionalInfo:
 *                     type: string
 *                     example: Near Central Park
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Not authorized to create this user role
 *       400:
 *         description: Bad request
 */
// Route to create a new user
router.post('/create', protect, authorize('super_user', 'system_admin', 'seller', 'buyer'), createUser);

/**
 * @swagger
 * /api/users/update/{id}:
 *   put:
 *     summary: Update an existing user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               role:
 *                 type: string
 *                 example: seller
 *               phone:
 *                 type: string
 *                 example: +1234567890
 *               address:
 *                 type: object
 *                 properties:
 *                   country:
 *                     type: string
 *                     example: USA
 *                   city:
 *                     type: string
 *                     example: New York
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Not authorized to update this user role
 *       404:
 *         description: User not found
 *       400:
 *         description: Bad request
 */
// Route to update a user
router.put('/update/:id', protect, authorize('super_user', 'system_admin', 'seller', 'buyer'), updateUser);



/**
 * @swagger
 * /api/users/delete/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Not authorized to delete this user
 *       404:
 *         description: User not found
 */
// Route to delete a user
router.delete('/delete/:id', protect, authorize('super_user', 'system_admin'), deleteUser);


/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
// Route to get all users (no authorization required)
router.get('/', protect, getAllUsers);


/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a single user by ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to fetch
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
// Route to get a single user by ID (no authorization required)
router.get('/:id', protect, getUserById);

module.exports = router;


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 60d5f48b6e6b3c001c8a2d8b
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: john.doe@example.com
 *         role:
 *           type: string
 *           example: buyer
 *         phone:
 *           type: string
 *           example: +1234567890
 *         address:
 *           type: object
 *           properties:
 *             country:
 *               type: string
 *               example: USA
 *             city:
 *               type: string
 *               example: New York
 *             neighborhood:
 *               type: string
 *               example: Brooklyn
 *             buildingNumber:
 *               type: string
 *               example: 123
 *             apartmentNumber:
 *               type: string
 *               example: 456
 *             additionalInfo:
 *               type: string
 *               example: Near Central Park
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: '2024-09-14T12:34:56.789Z'
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: '2024-09-14T12:34:56.789Z'
 */