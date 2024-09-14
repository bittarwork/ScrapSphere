const express = require('express');
const router = express.Router();
const {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
} = require('../controllers/transactionController');
const { protect, authorize } = require('../middlewares/authMiddleware');
/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Operations related to transactions.
 */

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction
 *     description: Creates a new transaction record.
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transaction_id:
 *                 type: string
 *                 example: 'txn123456'
 *               amount:
 *                 type: number
 *                 example: 100.50
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: '2024-09-15T00:00:00Z'
 *               payment_method:
 *                 type: string
 *                 enum: [credit_card, bank_transfer, paypal, other]
 *                 example: 'credit_card'
 *               status:
 *                 type: string
 *                 enum: [completed, pending, failed, refunded]
 *                 example: 'pending'
 *               payment:
 *                 type: string
 *                 format: objectId
 *                 example: '603d2f7e8f8f8d0b3c8d0e9a'
 *               user:
 *                 type: string
 *                 format: objectId
 *                 example: '603d2f7e8f8f8d0b3c8d0e9b'
 *               description:
 *                 type: string
 *                 example: 'Payment for invoice #12345'
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
// Route to create a new transaction
router.post('/', protect, authorize('system_admin', 'super_user'), createTransaction);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions
 *     description: Retrieves a list of all transactions.
 *     tags:
 *       - Transactions
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
// Route to get all transactions (accessible by admins and system managers)
router.get('/', protect, authorize('system_admin', 'super_user'), getAllTransactions);


/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Get a specific transaction
 *     description: Retrieves a transaction by its ID.
 *     tags:
 *       - Transactions
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the transaction to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
// Route to get a specific transaction by ID (accessible by admins and system managers)
router.get('/:id', protect, authorize('system_admin', 'super_user'), getTransactionById);


/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Update a transaction
 *     description: Updates a transaction record by its ID.
 *     tags:
 *       - Transactions
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the transaction to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transaction_id:
 *                 type: string
 *                 example: 'txn123456'
 *               amount:
 *                 type: number
 *                 example: 100.50
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: '2024-09-15T00:00:00Z'
 *               payment_method:
 *                 type: string
 *                 enum: [credit_card, bank_transfer, paypal, other]
 *                 example: 'credit_card'
 *               status:
 *                 type: string
 *                 enum: [completed, pending, failed, refunded]
 *                 example: 'pending'
 *               payment:
 *                 type: string
 *                 format: objectId
 *                 example: '603d2f7e8f8f8d0b3c8d0e9a'
 *               user:
 *                 type: string
 *                 format: objectId
 *                 example: '603d2f7e8f8f8d0b3c8d0e9b'
 *               description:
 *                 type: string
 *                 example: 'Payment for invoice #12345'
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
// Route to update a transaction (accessible by admins and system managers)
router.put('/:id', protect, authorize('system_admin', 'super_user'), updateTransaction);

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     description: Deletes a transaction by its ID.
 *     tags:
 *       - Transactions
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the transaction to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

// Route to delete a transaction (accessible by admins and system managers)
router.delete('/:id', protect, authorize('system_admin', 'super_user'), deleteTransaction);

module.exports = router;



