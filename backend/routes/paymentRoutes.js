const express = require('express');
const router = express.Router();
const {
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePayment,
    deletePayment
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: API endpoints for managing payments
 */

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Create a new payment
 *     tags: [Payments]
 *     description: Creates a new payment record.
 *     parameters:
 *       - in: body
 *         name: payment
 *         description: Payment details
 *         schema:
 *           type: object
 *           required:
 *             - payment_id
 *             - amount
 *             - method
 *             - user
 *           properties:
 *             payment_id:
 *               type: string
 *               description: Unique payment ID
 *             amount:
 *               type: number
 *               description: Amount of the payment
 *             date:
 *               type: string
 *               format: date
 *               description: Date of the payment
 *             method:
 *               type: string
 *               enum: [credit_card, bank_transfer, paypal, other]
 *               description: Payment method used
 *             status:
 *               type: string
 *               enum: [completed, pending, failed]
 *               description: Payment status
 *             user:
 *               type: string
 *               description: User ID who made the payment
 *             transaction:
 *               type: array
 *               items:
 *                 type: string
 *               description: Array of transaction IDs related to the payment
 *     responses:
 *       201:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post('/', protect, authorize('system_admin', 'super_user'), createPayment);

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Payments]
 *     description: Retrieves a list of all payments.
 *     responses:
 *       200:
 *         description: List of all payments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 *       500:
 *         description: Internal server error
 */
router.get('/', protect, authorize('system_admin', 'super_user'), getAllPayments);

/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     summary: Get a specific payment by ID
 *     tags: [Payments]
 *     description: Retrieves details of a specific payment.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the payment.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of the payment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', protect, authorize('system_admin', 'super_user'), getPaymentById);

/**
 * @swagger
 * /payments/{id}:
 *   put:
 *     summary: Update a payment
 *     tags: [Payments]
 *     description: Updates an existing payment record.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the payment.
 *         schema:
 *           type: string
 *       - in: body
 *         name: payment
 *         description: Updated payment details
 *         schema:
 *           type: object
 *           properties:
 *             payment_id:
 *               type: string
 *               description: Unique payment ID
 *             amount:
 *               type: number
 *               description: Amount of the payment
 *             date:
 *               type: string
 *               format: date
 *               description: Date of the payment
 *             method:
 *               type: string
 *               enum: [credit_card, bank_transfer, paypal, other]
 *               description: Payment method used
 *             status:
 *               type: string
 *               enum: [completed, pending, failed]
 *               description: Payment status
 *             user:
 *               type: string
 *               description: User ID who made the payment
 *             transaction:
 *               type: array
 *               items:
 *                 type: string
 *               description: Array of transaction IDs related to the payment
 *     responses:
 *       200:
 *         description: Payment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', protect, authorize('system_admin', 'super_user'), updatePayment);

/**
 * @swagger
 * /payments/{id}:
 *   delete:
 *     summary: Delete a payment
 *     tags: [Payments]
 *     description: Deletes a specific payment record.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the payment.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment deleted successfully
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', protect, authorize('system_admin', 'super_user'), deletePayment);

module.exports = router;
