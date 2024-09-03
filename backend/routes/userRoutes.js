const express = require('express');
const router = express.Router();
const {
    createUser,
    updateUser,
    deleteUser,
    getAllUsers,
    getUserById
} = require('../controllers/userController');

const { protect, authorize } = require('../middlewares/authMiddleware');

// Route to create a new user
router.post('/create', protect, authorize('super_user', 'system_admin', 'seller', 'buyer'), createUser);

// Route to update a user
router.put('/update/:id', protect, authorize('super_user', 'system_admin', 'seller', 'buyer'), updateUser);

// Route to delete a user
router.delete('/delete/:id', protect, authorize('super_user', 'system_admin'), deleteUser);

// Route to get all users (no authorization required)
router.get('/', protect, getAllUsers);

// Route to get a single user by ID (no authorization required)
router.get('/:id', protect, getUserById);

module.exports = router;
