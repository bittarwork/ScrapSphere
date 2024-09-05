const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');


// Load environment variables
dotenv.config();

const app = express();


/* -------------------------------------------------------------------------- */
/*                                  DataBase                                  */
/* -------------------------------------------------------------------------- */
// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected...');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit process with failure
    }
};
connectDB();


/* -------------------------------------------------------------------------- */
/*                                 middelware                                 */
/* -------------------------------------------------------------------------- */
// impoting middleware: 
const loogeridelware = require('./middlewares/looger');
// Middleware
app.use(express.json());
app.use(loogeridelware);

/* -------------------------------------------------------------------------- */
/*                                   routes                                   */
/* -------------------------------------------------------------------------- */
// import routs : 
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const scrapRoutes = require('./routes/scrapItemRoutes');
const bidRoutes = require('./routes/bidRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const transactiontRoutes = require('./routes/Transactions');
const notificationRoutes = require('./routes/notificationRoutes');
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/scrap', scrapRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/auction', auctionRoutes);
app.use('/api/paymen', paymentRoutes);
app.use('/api/transac', transactiontRoutes);
app.use('/api/notifications', notificationRoutes);
/* -------------------------------------------------------------------------- */
/*                                simple Route                                */
/* -------------------------------------------------------------------------- */
app.get('/', (req, res) => {
    res.send('API is running...');
});

/* -------------------------------------------------------------------------- */
/*                          Error Handling Middleware                         */
/* -------------------------------------------------------------------------- */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
