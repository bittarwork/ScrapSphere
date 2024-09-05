const mongoose = require('mongoose');
const { Schema } = mongoose;

const subscriptionSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subscriptionType: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        required: true
    },
    notificationType: {
        type: [String],
        enum: ['new_auctions', 'auction_updates', 'offers', 'other'],
        default: []
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

// Create the Mongoose model for newsletter subscriptions
const NewsletterSubscription = mongoose.model('NewsletterSubscription', subscriptionSchema);

module.exports = NewsletterSubscription;
