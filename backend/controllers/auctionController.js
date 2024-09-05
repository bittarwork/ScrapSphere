const asyncHandler = require('express-async-handler');
const Auction = require('../models/auctionModel');
const Bid = require('../models/bidModel');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create a new auction
// @route   POST /api/auctions
// @access  Private
exports.createAuction = asyncHandler(async (req, res, next) => {
    const { title, startDate, endDate, status, scrapItems } = req.body;

    // Validate required fields
    if (!title || !startDate || !endDate || !status || !scrapItems) {
        return next(new ErrorResponse('All fields (title, startDate, endDate, status, scrapItems) are required', 400));
    }

    // Create auction
    const auction = await Auction.create(req.body);

    res.status(201).json({
        success: true,
        data: auction
    });
});

// @desc    Get all auctions with optional filters
// @route   GET /api/auctions/filter
// @access  Public
exports.filterAuctions = asyncHandler(async (req, res, next) => {
    const { startDate, endDate, status } = req.query;
    const query = {};

    // Add filters to the query
    if (startDate) {
        if (isNaN(new Date(startDate).getTime())) {
            return next(new ErrorResponse('Invalid startDate format', 400));
        }
        query.startDate = { $gte: new Date(startDate) };
    }
    if (endDate) {
        if (isNaN(new Date(endDate).getTime())) {
            return next(new ErrorResponse('Invalid endDate format', 400));
        }
        query.endDate = { $lte: new Date(endDate) };
    }
    if (status) {
        if (!['active', 'completed', 'pending'].includes(status)) {
            return next(new ErrorResponse('Invalid status value', 400));
        }
        query.status = status;
    }

    // Find auctions with filters
    const auctions = await Auction.find(query).populate('scrapItems', 'description weight');

    res.status(200).json({
        success: true,
        count: auctions.length,
        data: auctions
    });
});

// @desc    Get auctions along with their highest bids
// @route   GET /api/auctions/with-bids
// @access  Public
exports.getAuctionsWithBids = asyncHandler(async (req, res, next) => {
    const auctions = await Auction.aggregate([
        {
            $lookup: {
                from: 'bids',
                localField: '_id',
                foreignField: 'auction',
                as: 'bids'
            }
        },
        {
            $addFields: {
                highestBid: { $max: '$bids.amount' }
            }
        }
    ]);

    res.status(200).json({
        success: true,
        count: auctions.length,
        data: auctions
    });
});

// @desc    End an auction by updating its status
// @route   PATCH /api/auctions/end/:id
// @access  Private
exports.endAuction = asyncHandler(async (req, res, next) => {
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
        return next(new ErrorResponse(`Auction not found with ID of ${req.params.id}`, 404));
    }

    // Check if auction is already completed
    if (auction.status === 'completed') {
        return next(new ErrorResponse('Auction is already completed', 400));
    }

    // Update auction status to 'completed'
    auction.status = 'completed';
    await auction.save();

    res.status(200).json({
        success: true,
        data: auction
    });
});

// @desc    Get all bids placed by a specific user
// @route   GET /api/users/:userId/bids
// @access  Private
exports.getUserBids = asyncHandler(async (req, res, next) => {
    const userId = req.params.userId;

    // Validate userId
    if (!userId) {
        return next(new ErrorResponse('User ID is required', 400));
    }

    // Check if the user exists
    const bids = await Bid.find({ user: userId }).populate('auction', 'title startDate endDate');

    if (bids.length === 0) {
        return next(new ErrorResponse('No bids found for this user', 404));
    }

    res.status(200).json({
        success: true,
        count: bids.length,
        data: bids
    });
});

// @desc    Get all active auctions
// @route   GET /api/auctions/active
// @access  Public
exports.getActiveAuctions = asyncHandler(async (req, res, next) => {
    const now = new Date();
    const auctions = await Auction.find({
        startDate: { $lte: now },
        endDate: { $gte: now },
        status: 'active'
    }).populate('scrapItems', 'description weight');

    res.status(200).json({
        success: true,
        count: auctions.length,
        data: auctions
    });
});

// @desc    Get statistics for auctions
// @route   GET /api/auctions/stats
// @access  Public
exports.getAuctionStats = asyncHandler(async (req, res, next) => {
    const totalAuctions = await Auction.countDocuments();
    const totalBids = await Bid.countDocuments();
    const highestBid = await Bid.findOne().sort({ amount: -1 }).select('amount');

    res.status(200).json({
        success: true,
        data: {
            totalAuctions,
            totalBids,
            highestBid: highestBid ? highestBid.amount : 0
        }
    });
});

// @desc    Get details of a specific auction with all bids
// @route   GET /api/auctions/:id/details
// @access  Public
exports.getAuctionDetailsWithBids = asyncHandler(async (req, res, next) => {
    const auction = await Auction.findById(req.params.id).populate('scrapItems', 'description weight');

    if (!auction) {
        return next(new ErrorResponse(`Auction not found with ID of ${req.params.id}`, 404));
    }

    const bids = await Bid.find({ auction: req.params.id }).populate('user', 'name email');

    res.status(200).json({
        success: true,
        data: {
            auction,
            bids
        }
    });
});

// @desc    Update details of an existing auction
// @route   PUT /api/auctions/:id
// @access  Private
exports.updateAuction = asyncHandler(async (req, res, next) => {
    const { title, startDate, endDate, status, scrapItems } = req.body;

    // Validate required fields
    if (!title || !startDate || !endDate || !status || !scrapItems) {
        return next(new ErrorResponse('All fields (title, startDate, endDate, status, scrapItems) are required', 400));
    }

    const auction = await Auction.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!auction) {
        return next(new ErrorResponse(`Auction not found with ID of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: auction
    });
});
