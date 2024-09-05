const mongoose = require('mongoose');
const { Schema } = mongoose;

const auctionSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    scrap_item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ScrapItem',
        required: [true, 'Scrap item reference is required']
    },
    start_date: {
        type: Date,
        required: [true, 'Start date is required']
    },
    end_date: {
        type: Date,
        required: [true, 'End date is required']
    },
    status: {
        type: String,
        enum: ['open', 'closed', 'cancelled'],
        default: 'open'
    },
    highest_bid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bid',
        default: null
    },
    reserve_price: {
        type: Number,
        required: [true, 'Reserve price is required'],
        min: [0, 'Reserve price must be greater than or equal to 0']
    },
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now,
        set: function (val) {
            return val || Date.now;
        }
    }
});

auctionSchema.pre('save', function (next) {
    const auction = this;

    if (auction.start_date >= auction.end_date) {
        return next(new Error('End date must be after the start date'));
    }

    next();
});

auctionSchema.post('save', async function () {
    const auction = this;

    if (auction.status === 'open') {
        const currentDate = new Date();
        if (currentDate > auction.end_date) {
            auction.status = 'closed';
            await auction.save();
        }
    }

    if (auction.status === 'closed' && auction.highest_bid) {
        const highestBid = await mongoose.model('Bid').findById(auction.highest_bid);
        if (highestBid) {
            auction.winner = highestBid.bidder;
            await auction.save();
        }
    }
});

const Auction = mongoose.model('Auction', auctionSchema);

module.exports = Auction;
