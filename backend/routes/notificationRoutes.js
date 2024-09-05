// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const {
    subscribeUser,
    sendNotifications
} = require('../controllers/notificationController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Route to create or update a notification subscription
router.post('/', protect, authorize('buyer', 'seller', 'auction_manager', 'system_admin', 'super_user'), subscribeUser);

// Route to manually trigger sending notifications (optional, might be scheduled via cron job)
router.post('/send', sendNotifications);

module.exports = router;
