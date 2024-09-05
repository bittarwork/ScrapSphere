const Bid = require('../models/bidModel');
const Auction = require('../models/auctionModel');
const User = require('../models/userModel');

// 1. Create a new bid
exports.createBid = async (req, res) => {
    try {
        const { auctionId, amount } = req.body;
        const user = req.user;

        // Validate auction existence
        const auction = await Auction.findById(auctionId);
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }

        // Check if auction is open for bidding
        if (auction.status !== 'open') {
            return res.status(400).json({ message: 'Auction is not open for bidding' });
        }

        // Validate bid amount
        const highestBid = auction.highest_bid ? await Bid.findById(auction.highest_bid) : null;
        if (highestBid && amount <= highestBid.amount) {
            return res.status(400).json({ message: 'Bid amount must be higher than the current highest bid' });
        }

        // Create new bid
        const bid = await Bid.create({
            auction: auctionId,
            amount,
            bidder: user._id
        });

        // Update auction with the new highest bid
        auction.highest_bid = bid._id;
        await auction.save();

        res.status(201).json(bid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// 2. Get all bids for a specific auction
exports.getBidsByAuction = async (req, res) => {
    try {
        const { auctionId } = req.params;

        // Validate auction existence
        const auction = await Auction.findById(auctionId);
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }

        // Retrieve all bids for the auction
        const bids = await Bid.find({ auction: auctionId }).populate('bidder', 'name email');

        res.status(200).json(bids);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// 3. Get details of a specific bid
exports.getBid = async (req, res) => {
    try {
        const { bidId } = req.params;

        // Retrieve bid details
        const bid = await Bid.findById(bidId).populate('bidder', 'name email');
        if (!bid) {
            return res.status(404).json({ message: 'Bid not found' });
        }

        res.status(200).json(bid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// 4. Update a bid
exports.updateBid = async (req, res) => {
    try {
        const { bidId } = req.params;
        const { amount } = req.body;

        // Validate bid existence
        const bid = await Bid.findById(bidId);
        if (!bid) {
            return res.status(404).json({ message: 'Bid not found' });
        }

        // Validate new bid amount
        const auction = await Auction.findById(bid.auction);
        const highestBid = auction.highest_bid ? await Bid.findById(auction.highest_bid) : null;
        if (highestBid && amount <= highestBid.amount) {
            return res.status(400).json({ message: 'Bid amount must be higher than the current highest bid' });
        }

        // Update bid
        bid.amount = amount;
        await bid.save();

        // Update auction with the new highest bid
        auction.highest_bid = bid._id;
        await auction.save();

        res.status(200).json(bid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// 5. Delete a bid
exports.deleteBid = async (req, res) => {
    try {
        const { bidId } = req.params;

        // Validate bid existence
        const bid = await Bid.findById(bidId);
        if (!bid) {
            return res.status(404).json({ message: 'Bid not found' });
        }

        // Delete bid
        await bid.remove();

        // Check if the deleted bid was the highest bid in the auction
        const auction = await Auction.findById(bid.auction);
        if (auction.highest_bid.toString() === bidId) {
            // Recalculate the highest bid for the auction
            const highestBid = await Bid.findOne({ auction: bid.auction }).sort({ amount: -1 });
            auction.highest_bid = highestBid ? highestBid._id : null;
            await auction.save();
        }

        res.status(200).json({ message: 'Bid deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
