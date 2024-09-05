const Subscription = require('../models/Subscription');
const User = require('../models/userModel');
const sendEmail = require('../services/emailService');

// Subscribe a user to notifications
exports.subscribeUser = async (req, res) => {
    try {
        const { userId, frequency, categories } = req.body;

        // Validate user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create or update subscription
        const subscription = await Subscription.findOneAndUpdate(
            { user: userId },
            { frequency, categories },
            { new: true, upsert: true } // Create if not exists, return the updated document
        );

        res.status(200).json(subscription);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Send notifications based on subscription
exports.sendNotifications = async () => {
    try {
        const subscriptions = await Subscription.find();
        const now = new Date();

        for (const subscription of subscriptions) {
            const user = await User.findById(subscription.user);
            if (!user) continue;

            const shouldSendEmail = (subscription.frequency === 'daily' ||
                (subscription.frequency === 'weekly' && now.getDay() === 0) ||
                (subscription.frequency === 'monthly' && now.getDate() === 1));

            if (shouldSendEmail) {
                const emailContent = generateEmailContent(subscription);
                await sendEmail(user.email, 'Your Subscription Updates', emailContent);
            }
        }
    } catch (error) {
        console.error('Failed to send notifications:', error);
    }
};
// Generate email content based on subscription
function generateEmailContent(subscription) {
    let content = '<h1>Your Subscription Updates</h1>';

    if (subscription.categories.includes('auctions')) {
        content += '<h2>Upcoming Auctions</h2>';
        // Fetch and add auction data
        // Example: content += '<p>Auction 1 details...</p>';
    }
    if (subscription.categories.includes('bids')) {
        content += '<h2>Recent Bids</h2>';
        // Fetch and add bid data
        // Example: content += '<p>Bid 1 details...</p>';
    }
    if (subscription.categories.includes('system_updates')) {
        content += '<h2>System Updates</h2>';
        // Fetch and add system updates
        // Example: content += '<p>System update details...</p>';
    }

    return content || '<p>No updates available at the moment.</p>';
}
