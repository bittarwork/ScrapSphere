const mongoose = require('mongoose');
const { Schema } = mongoose;

// نموذج العروض (Bid)
const bidSchema = new Schema({
    amount: {
        type: Number,
        required: [true, 'Bid amount is required'],
        min: [0, 'Bid amount must be greater than or equal to 0']
    },
    auction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction',
        required: [true, 'Auction reference is required']
    },
    bidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Bidder reference is required']
    },
    bid_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'accepted', 'rejected'],
        default: 'active'
    }
});

bidSchema.pre('save', async function (next) {
    const bid = this;
    const auction = await mongoose.model('Auction').findById(bid.auction);

    if (!auction) {
        return next(new Error('Auction not found'));
    }

    if (auction.status !== 'open') {
        return next(new Error('Auction is not open for bidding'));
    }

    if (auction.highest_bid && bid.amount <= auction.highest_bid.amount) {
        return next(new Error('Bid amount must be higher than the current highest bid'));
    }

    next();
});

bidSchema.post('save', async function () {
    const bid = this;
    const auction = await mongoose.model('Auction').findById(bid.auction);

    if (auction) {
        auction.highest_bid = bid;
        await auction.save();
    }
});

const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;
