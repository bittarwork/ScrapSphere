const express = require('express');
const router = express.Router();
const {
    createBid,
    getBidsByAuction,
    getBid,
    updateBid,
    deleteBid
} = require('../controllers/bidController');

const { protect, authorize } = require('../middlewares/authMiddleware');

// Route to create a new bid
router.post('/create', protect, authorize('buyer'), createBid);

// Route to get all bids for a specific auction
router.get('/auction/:auctionId', protect, getBidsByAuction);

// Route to get details of a specific bid
router.get('/:bidId', protect, getBid);

// Route to update a bid
router.put('/update/:bidId', protect, authorize('buyer'), updateBid);

// Route to delete a bid
router.delete('/delete/:bidId', protect, authorize('buyer', 'system_admin'), deleteBid);

module.exports = router;
