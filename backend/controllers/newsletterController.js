const NewsletterSubscription = require('../models/NewsletterSubscription');
const User = require('../models/User');

const subscribeToNewsletter = async (req, res) => {
    try {
        const { userId, subscriptionType, notificationType } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingSubscription = await NewsletterSubscription.findOne({ user: userId });
        if (existingSubscription) {
            return res.status(400).json({ message: 'User already subscribed' });
        }

        const subscription = new NewsletterSubscription({
            user: userId,
            subscriptionType,
            notificationType
        });

        await subscription.save();
        res.status(201).json(subscription);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const updateSubscription = async (req, res) => {
    try {
        const { userId } = req.params;
        const { subscriptionType, notificationType } = req.body;

        const subscription = await NewsletterSubscription.findOne({ user: userId });
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        subscription.subscriptionType = subscriptionType || subscription.subscriptionType;
        subscription.notificationType = notificationType || subscription.notificationType;
        subscription.updated_at = Date.now();

        await subscription.save();
        res.status(200).json(subscription);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const unsubscribe = async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await NewsletterSubscription.deleteOne({ user: userId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        res.status(200).json({ message: 'Unsubscribed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    subscribeToNewsletter,
    updateSubscription,
    unsubscribe
};
