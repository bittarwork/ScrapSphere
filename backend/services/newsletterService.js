const { sendEmail } = require('./emailService');
const NewsletterSubscription = require('../models/NewsletterSubscription');
const Auction = require('../models/Auction');
const User = require('../models/User');
const moment = require('moment');

const sendNewsletter = async () => {
    try {
        const now = moment();
        const startOfWeek = moment().startOf('week').add(1, 'week').toDate();
        const endOfWeek = moment(startOfWeek).endOf('week').toDate();

        const upcomingAuctions = await Auction.find({
            start_date: { $gte: startOfWeek, $lt: endOfWeek }
        });

        const subscriptions = await NewsletterSubscription.find();
        for (const subscription of subscriptions) {
            let subject, text, html;

            switch (subscription.subscriptionType) {
                case 'daily':

                    break;
                case 'weekly':
                    subject = 'Weekly Auction Newsletter';
                    text = `Here are the auctions happening next week:\n\n${upcomingAuctions.map(auction => `${auction.title} - ${auction.start_date}`).join('\n')}`;
                    html = `<p>Here are the auctions happening next week:</p><ul>${upcomingAuctions.map(auction => `<li>${auction.title} - ${moment(auction.start_date).format('MMM D, YYYY')}</li>`).join('')}</ul>`;
                    break;
                case 'monthly':
                    break;
            }

            if (subject && text && html) {
                const user = await User.findById(subscription.user);
                if (user) {
                    await sendEmail(user.email, subject, text, html);
                }
            }
        }

        console.log('Newsletters sent successfully');
    } catch (error) {
        console.error('Error sending newsletters: ', error);
    }
};

module.exports = { sendNewsletter };
