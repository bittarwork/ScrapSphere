const mongoose = require('mongoose');
const { Schema } = mongoose;

const subscriptionSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        required: true
    },
    categories: {
        type: [String],
        enum: ['auctions', 'bids', 'system_updates'],
        default: []
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Automatically manage created_at and updated_at fields
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
