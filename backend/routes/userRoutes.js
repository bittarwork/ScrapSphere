// routes/userRoutes.js
const express = require('express');
const { getUserById, updateUserById, getAllRoles, createRole, updateRole, deleteRole, getUserInteractions } = require('../controllers/userController');
const { protect, admin, auctionManager } = require('../middlewares/authMiddleware');

const router = express.Router();

// User management routes
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUserById);

// Role and permissions routes
router.get('/roles', protect, admin, getAllRoles);
router.post('/roles', protect, admin, createRole);
router.put('/roles/:roleId', protect, admin, updateRole);
router.delete('/roles/:roleId', protect, admin, deleteRole);

// User interactions routes
router.get('/:id/interactions', protect, getUserInteractions);

module.exports = router;
