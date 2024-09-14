const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');  // تم إضافة CORS
const { swaggerUi, specs } = require('./doc/swagger');

dotenv.config();

const app = express();

/* -------------------------------------------------------------------------- */
/*                                  DataBase                                  */
/* -------------------------------------------------------------------------- */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log('MongoDB connected...');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit process with failure
    }
};
connectDB();

/* -------------------------------------------------------------------------- */
/*                                 middleware                                 */
/* -------------------------------------------------------------------------- */
const loogerMiddleware = require('./middlewares/looger');
app.use(express.json());
app.use(loogerMiddleware);
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

/* -------------------------------------------------------------------------- */
/*                                   Swagger                                  */
/* -------------------------------------------------------------------------- */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

/* -------------------------------------------------------------------------- */
/*                                   routes                                   */
/* -------------------------------------------------------------------------- */
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const scrapRoutes = require('./routes/scrapItemRoutes');
const bidRoutes = require('./routes/bidRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const transactiontRoutes = require('./routes/Transactions');
const notificationRoutes = require('./routes/notificationRoutes');

// إضافة المسارات الخاصة بـ API
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
