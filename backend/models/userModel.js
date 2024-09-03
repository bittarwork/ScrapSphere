const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        validate: [validator.isEmail, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false // This ensures the password is not returned when fetching the user
    },
    role: {
        type: String,
        enum: ['seller', 'buyer', 'auction_manager', 'system_admin', 'super_user'],
        default: 'buyer',  // Default role
        required: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        country: {
            type: String,
            required: false
        },
        city: {
            type: String,
            required: false
        },
        neighborhood: {
            type: String,
            required: false
        },
        buildingNumber: {
            type: String,
            required: false
        },
        apartmentNumber: {
            type: String,
            required: false
        },
        additionalInfo: {
            type: String,
            default: null
        }
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
    const user = this;

    // Check if the password was modified
    if (!user.isModified('password')) return next();

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
});

// Compare the password during login
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Create the model
const User = mongoose.model('User', userSchema);

module.exports = User;
