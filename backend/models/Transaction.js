const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
    transaction_id: {
        type: String,
        required: [true, 'Transaction ID is required'],
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
    payment_method: {
        type: String,
        enum: ['credit_card', 'bank_transfer', 'paypal', 'other'],
        required: [true, 'Payment method is required']
    },
    status: {
        type: String,
        enum: ['completed', 'pending', 'failed', 'refunded'],
        default: 'pending'
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
        required: [true, 'Payment reference is required']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User reference is required']
    },
    description: {
        type: String,
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

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
