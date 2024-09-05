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

// Route to create a new transaction
router.post('/', protect, authorize('system_admin', 'super_user'), createTransaction);

// Route to get all transactions (accessible by admins and system managers)
router.get('/', protect, authorize('system_admin', 'super_user'), getAllTransactions);

// Route to get a specific transaction by ID (accessible by admins and system managers)
router.get('/:id', protect, authorize('system_admin', 'super_user'), getTransactionById);

// Route to update a transaction (accessible by admins and system managers)
router.put('/:id', protect, authorize('system_admin', 'super_user'), updateTransaction);

// Route to delete a transaction (accessible by admins and system managers)
router.delete('/:id', protect, authorize('system_admin', 'super_user'), deleteTransaction);

module.exports = router;
