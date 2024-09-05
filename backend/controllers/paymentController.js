const Payment = require('../models/Payment');
const Transaction = require('../models/Transaction');

// إنشاء مدفوعات جديدة
exports.createPayment = async (req, res) => {
    try {
        const payment = new Payment({
            payment_id: req.body.payment_id,
            amount: req.body.amount,
            date: req.body.date,
            method: req.body.method,
            status: req.body.status,
            user: req.body.user,
            transaction: req.body.transaction // يمكن أن تكون مصفوفة من المعاملات
        });

        const savedPayment = await payment.save();
        res.status(201).json(savedPayment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// الحصول على كل المدفوعات
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('transaction');
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// الحصول على دفع محدد
exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).populate('transaction');
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// تحديث دفع
exports.updatePayment = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// حذف دفع
exports.deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndDelete(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
