const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new Schema({
    payment_id: {
        type: String,
        required: [true, 'Payment ID is required'],
        unique: true
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount must be greater than or equal to 0']
    },
    date: {
        type: Date,
        default: Date.now
    },
    method: {
        type: String,
        enum: ['credit_card', 'bank_transfer', 'paypal', 'other'],
        required: [true, 'Payment method is required']
    },
    status: {
        type: String,
        enum: ['completed', 'pending', 'failed'],
        default: 'pending'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User reference is required']
    },
    transaction: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    }],
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

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
