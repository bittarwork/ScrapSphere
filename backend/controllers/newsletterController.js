// controllers/newsletterController.js

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
