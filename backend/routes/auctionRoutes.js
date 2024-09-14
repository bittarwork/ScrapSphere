/**
 * @swagger
 * components:
 *   schemas:
 *     Auction:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "Auction for Rare Antique"
 *         description:
 *           type: string
 *           example: "A rare antique item auction starting soon."
 *         scrap_item:
 *           type: string
 *           example: "613b0e4f3f8d1a3b8c8d08e5"  
 *         start_date:
 *           type: string
 *           format: date-time
 *           example: "2024-09-15T00:00:00Z"
 *         end_date:
 *           type: string
 *           format: date-time
 *           example: "2024-09-30T23:59:59Z"
 *         status:
 *           type: string
 *           enum: [open, closed, cancelled]
 *           example: "open"
 *         highest_bid:
 *           type: string
 *           example: "613b0e4f3f8d1a3b8c8d08e6"  
 *         reserve_price:
 *           type: number
 *           example: 1000
 *         winner:
 *           type: string
 *           example: "613b0e4f3f8d1a3b8c8d08e7" 
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-09-01T12:00:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2024-09-01T12:00:00Z"
 *     Bid:
 *       type: object
 *       properties:
 *         amount:
 *           type: number
 *           example: 1200
 *         auction:
 *           type: string
 *           example: "613b0e4f3f8d1a3b8c8d08e8"  
 *         bidder:
 *           type: string
 *           example: "613b0e4f3f8d1a3b8c8d08e7"  
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-09-01T12:00:00Z"
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Invalid status value"
 *         statusCode:
 *           type: integer
 *           example: 400
 */
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

/**
 * @swagger
 * /api/auctions:
 *   post:
 *     summary: Create a new auction
 *     tags: [Auctions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auction'
 *           examples:
 *             example1:
 *               value:
 *                 title: "Auction for Rare Antique"
 *                 description: "A rare antique item auction starting soon."
 *                 scrap_item: "613b0e4f3f8d1a3b8c8d08e5"
 *                 start_date: "2024-09-15T00:00:00Z"
 *                 end_date: "2024-09-30T23:59:59Z"
 *                 status: "open"
 *                 reserve_price: 1000
 *     responses:
 *       201:
 *         description: Auction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auction'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Route to create a new auction
router.post('/', protect, authorize('auction_manager', 'super_user'), createAuction);

/**
 * @swagger
 * /api/auctions/filter:
 *   get:
 *     summary: Get all auctions with optional filters
 *     tags: [Auctions]
 *     parameters:
 *       - name: startDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date-time
 *         example: "2024-09-01T00:00:00Z"
 *       - name: endDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date-time
 *         example: "2024-09-30T23:59:59Z"
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [open, closed, cancelled]
 *         example: "open"
 *     responses:
 *       200:
 *         description: List of auctions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Auction'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Route to get all auctions with optional filters
router.get('/filter', filterAuctions);


/**
 * @swagger
 * /api/auctions/with-bids:
 *   get:
 *     summary: Get all auctions with their highest bids
 *     tags: [Auctions]
 *     responses:
 *       200:
 *         description: List of auctions with their highest bids
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Auction'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Route to get all auctions with their highest bids
router.get('/with-bids', getAuctionsWithBids);

/**
 * @swagger
 * /api/auctions/end/{id}:
 *   patch:
 *     summary: End an auction by updating its status
 *     tags: [Auctions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Auction ID
 *         schema:
 *           type: string
 *           example: "613b0e4f3f8d1a3b8c8d08e8"
 *     responses:
 *       200:
 *         description: Auction status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auction'
 *       404:
 *         description: Auction not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Auction already completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Route to end an auction by updating its status
router.patch('/end/:id', protect, authorize('auction_manager', 'super_user'), endAuction);

/**
 * @swagger
 * /api/users/{userId}/bids:
 *   get:
 *     summary: Get all bids placed by a specific user
 *     tags: [Bids]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *           example: "613b0e4f3f8d1a3b8c8d08e7"
 *     responses:
 *       200:
 *         description: List of bids for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Bid'
 *       404:
 *         description: No bids found for this user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Route to get all bids placed by a specific user
router.get('/users/:userId/bids', protect, authorize('auction_manager', 'super_user'), getUserBids);

/**
 * @swagger
 * /api/auctions/active:
 *   get:
 *     summary: Get all active auctions
 *     tags: [Auctions]
 *     responses:
 *       200:
 *         description: List of active auctions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 4
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Auction'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Route to get all active auctions
router.get('/active', getActiveAuctions);

/**
 * @swagger
 * /api/auctions/stats:
 *   get:
 *     summary: Get auction statistics
 *     tags: [Auctions]
 *     responses:
 *       200:
 *         description: Auction statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_auctions:
 *                   type: integer
 *                   example: 50
 *                 total_bids:
 *                   type: integer
 *                   example: 200
 *                 average_bid_amount:
 *                   type: number
 *                   example: 800
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Route to get auction statistics
router.get('/stats', getAuctionStats);

/**
 * @swagger
 * /api/auctions/{id}/details:
 *   get:
 *     summary: Get details of a specific auction with all bids
 *     tags: [Auctions]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Auction ID
 *         schema:
 *           type: string
 *           example: "613b0e4f3f8d1a3b8c8d08e8"
 *     responses:
 *       200:
 *         description: Auction details with all bids
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     auction:
 *                       $ref: '#/components/schemas/Auction'
 *                     bids:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Bid'
 *       404:
 *         description: Auction not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Route to get details of a specific auction with all bids
router.get('/:id/details', getAuctionDetailsWithBids);

/**
 * @swagger
 * /api/auctions/{id}:
 *   put:
 *     summary: Update details of an existing auction
 *     tags: [Auctions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Auction ID
 *         schema:
 *           type: string
 *           example: "613b0e4f3f8d1a3b8c8d08e8"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auction'
 *           examples:
 *             example1:
 *               value:
 *                 title: "Updated Auction Title"
 *                 description: "Updated description for the auction."
 *                 scrap_item: "613b0e4f3f8d1a3b8c8d08e5"
 *                 start_date: "2024-09-16T00:00:00Z"
 *                 end_date: "2024-10-01T23:59:59Z"
 *                 status: "open"
 *                 reserve_price: 1200
 *     responses:
 *       200:
 *         description: Auction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auction'
 *       404:
 *         description: Auction not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Route to update an existing auction
router.put('/:id', protect, authorize('auction_manager', 'super_user'), updateAuction);

module.exports = router;


module.exports = router;
