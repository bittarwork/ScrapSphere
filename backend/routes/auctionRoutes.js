const express = require('express');
const router = express.Router();
const {
    createAuction,
    filterAuctions,
    getAuctionsWithBids,
    endAuction,
    getUserBids,
    getActiveAuctions,
    getAuctionStats,
    getAuctionDetailsWithBids,
    updateAuction
} = require('../controllers/auctionController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Route to create a new auction
router.post('/', protect, authorize('auction_manager', 'super_user'), createAuction);

// Route to get all auctions with optional filters
router.get('/filter', filterAuctions);

// Route to get all auctions with their highest bids
router.get('/with-bids', getAuctionsWithBids);

// Route to end an auction by updating its status
router.patch('/end/:id', protect, authorize('auction_manager', 'super_user'), endAuction);

// Route to get all bids placed by a specific user
router.get('/users/:userId/bids', protect, authorize('auction_manager', 'super_user'), getUserBids);

// Route to get all active auctions
router.get('/active', getActiveAuctions);

// Route to get auction statistics
router.get('/stats', getAuctionStats);

// Route to get details of a specific auction with all bids
router.get('/:id/details', getAuctionDetailsWithBids);

// Route to update an existing auction
router.put('/:id', protect, authorize('auction_manager', 'super_user'), updateAuction);

module.exports = router;
