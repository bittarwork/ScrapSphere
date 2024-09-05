const express = require('express');
const router = express.Router();
const { subscribeToNewsletter, updateSubscription, unsubscribe } = require('../controllers/newsletterController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/subscribe', protect, subscribeToNewsletter);
router.put('/update/:userId', protect, updateSubscription);
router.delete('/unsubscribe/:userId', protect, unsubscribe);

module.exports = router;
