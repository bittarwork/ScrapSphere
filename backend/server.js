// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.log('MongoDB connection error: ', err));

// Routes
// Example: app.use('/api/auth', require('./routes/authRoutes'));

// Server Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
