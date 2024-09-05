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

// Route to create a new payment
router.post('/', protect, authorize('system_admin', 'super_user'), createPayment);

// Route to get all payments (accessible by admins and system managers)
router.get('/', protect, authorize('system_admin', 'super_user'), getAllPayments);

// Route to get a specific payment by ID (accessible by admins and system managers)
router.get('/:id', protect, authorize('system_admin', 'super_user'), getPaymentById);

// Route to update a payment (accessible by admins and system managers)
router.put('/:id', protect, authorize('system_admin', 'super_user'), updatePayment);

// Route to delete a payment (accessible by admins and system managers)
router.delete('/:id', protect, authorize('system_admin', 'super_user'), deletePayment);

module.exports = router;
