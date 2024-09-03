const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, verifyToken } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Route to register a new user
router.post('/register', registerUser);

// Route to login a user
router.post('/login', loginUser);

// Route to get user profile
router.get('/profile', protect, getUserProfile);

// Route to verify JWT token
router.post('/verifyToken', verifyToken);

module.exports = router;
