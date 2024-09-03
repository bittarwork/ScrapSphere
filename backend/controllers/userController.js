const User = require('../models/userModel');
const { protect, authorize } = require('../middlewares/authMiddleware');

// @desc    Create a new user
// @route   POST /api/users
// @access  Private
exports.createUser = async (req, res) => {
    const { name, email, password, role, phone, address } = req.body;

    if (role === 'auction_manager' && !['super_user', 'system_admin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Not authorized to create auction_manager' });
    }

    if (role === 'system_admin' && req.user.role !== 'super_user') {
        return res.status(403).json({ message: 'Not authorized to create system_admin' });
    }

    try {
        const user = await User.create({ name, email, password, role, phone, address });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res) => {
    const { id } = req.params;

    if (['auction_manager', 'system_admin'].includes(req.body.role) && !['super_user', 'system_admin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Not authorized to update this user' });
    }

    try {
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Delete user
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!['super_user', 'system_admin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Not authorized to delete this user' });
    }

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
exports.getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

