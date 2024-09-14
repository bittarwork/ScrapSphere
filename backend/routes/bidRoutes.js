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

/**
 * @swagger
 * tags:
 *   name: Bids
 *   description: API endpoints for managing bids
 */

/**
 * @swagger
 * /bids/create:
 *   post:
 *     summary: Create a new bid
 *     tags: [Bids]
 *     description: Allows a buyer to place a new bid on an auction.
 *     parameters:
 *       - in: body
 *         name: bid
 *         description: Bid details
 *         schema:
 *           type: object
 *           required:
 *             - auctionId
 *             - amount
 *           properties:
 *             auctionId:
 *               type: string
 *               description: The ID of the auction.
 *             amount:
 *               type: number
 *               description: The amount of the bid.
 *     responses:
 *       201:
 *         description: Bid created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bid'
 *       400:
 *         description: Invalid input or auction not open
 *       500:
 *         description: Internal server error
 */
router.post('/create', protect, authorize('buyer'), createBid);

/**
 * @swagger
 * /bids/auction/{auctionId}:
 *   get:
 *     summary: Get all bids for a specific auction
 *     tags: [Bids]
 *     description: Retrieves all bids placed on a specific auction.
 *     parameters:
 *       - in: path
 *         name: auctionId
 *         required: true
 *         description: The ID of the auction.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of bids for the auction
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bid'
 *       404:
 *         description: Auction not found
 *       500:
 *         description: Internal server error
 */
router.get('/auction/:auctionId', protect, getBidsByAuction);

/**
 * @swagger
 * /bids/{bidId}:
 *   get:
 *     summary: Get details of a specific bid
 *     tags: [Bids]
 *     description: Retrieves details of a specific bid.
 *     parameters:
 *       - in: path
 *         name: bidId
 *         required: true
 *         description: The ID of the bid.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of the bid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bid'
 *       404:
 *         description: Bid not found
 *       500:
 *         description: Internal server error
 */
router.get('/:bidId', protect, getBid);

/**
 * @swagger
 * /bids/update/{bidId}:
 *   put:
 *     summary: Update a bid
 *     tags: [Bids]
 *     description: Allows a buyer to update the amount of an existing bid.
 *     parameters:
 *       - in: path
 *         name: bidId
 *         required: true
 *         description: The ID of the bid.
 *         schema:
 *           type: string
 *       - in: body
 *         name: bid
 *         description: Updated bid details
 *         schema:
 *           type: object
 *           required:
 *             - amount
 *           properties:
 *             amount:
 *               type: number
 *               description: The new amount of the bid.
 *     responses:
 *       200:
 *         description: Bid updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bid'
 *       400:
 *         description: Invalid bid amount or bid not found
 *       404:
 *         description: Bid not found
 *       500:
 *         description: Internal server error
 */
router.put('/update/:bidId', protect, authorize('buyer'), updateBid);

/**
 * @swagger
 * /bids/delete/{bidId}:
 *   delete:
 *     summary: Delete a bid
 *     tags: [Bids]
 *     description: Allows a buyer or system admin to delete a specific bid.
 *     parameters:
 *       - in: path
 *         name: bidId
 *         required: true
 *         description: The ID of the bid.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bid deleted successfully
 *       404:
 *         description: Bid not found
 *       500:
 *         description: Internal server error
 */
router.delete('/delete/:bidId', protect, authorize('buyer', 'system_admin'), deleteBid);

module.exports = router;
