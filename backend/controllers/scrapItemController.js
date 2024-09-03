const Scrap = require('../models/scrapItemModel');
const User = require('../models/userModel'); // استيراد نموذج المستخدم
const { validationResult } = require('express-validator');

// Utility function to check if a user exists
const checkUserExists = async (userId) => {
    return User.findById(userId);
};


// @desc Create a new scrap item with images
// @route POST /api/scrap
// @access Private (Admin/Manager)
exports.createScrapItem = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation errors', errors: errors.array() });
    }

    const { name, received_by, sorted_by } = req.body;

    try {
        // Check if the item already exists
        const existingScrap = await Scrap.findOne({ name });
        if (existingScrap) {
            return res.status(400).json({ message: 'Scrap item already exists' });
        }

        // Verify that the users exist
        const receivedByUser = await checkUserExists(received_by);
        const sortedByUser = await checkUserExists(sorted_by);
        if (!receivedByUser || !sortedByUser) {
            return res.status(404).json({ message: 'Received by or sorted by user not found' });
        }

        // Create the new scrap item
        const newScrap = await Scrap.create(req.body);
        res.status(201).json(newScrap);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', details: error.message });
    }
};

// @desc Get all scrap items
// @route GET /api/scrap
// @access Public
exports.getAllScrapItems = async (req, res) => {
    try {
        const scraps = await Scrap.find();
        res.status(200).json(scraps);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', details: error.message });
    }
};

// @desc Get a single scrap item by ID
// @route GET /api/scrap/:id
// @access Public
exports.getScrapItemById = async (req, res) => {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    try {
        const scrap = await Scrap.findById(id);
        if (!scrap) {
            return res.status(404).json({ message: 'Scrap item not found' });
        }
        res.status(200).json(scrap);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', details: error.message });
    }
};

// @desc Update a scrap item by ID with images
// @route PUT /api/scrap/:id
// @access Private (Admin/Manager)
exports.updateScrapItemById = async (req, res) => {
    const { id } = req.params;
    const { images = [], name, description, category, location, status } = req.body;
    const userId = req.user.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    try {
        // Check if the user exists
        const user = await checkUserExists(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the scrap item exists
        const scrap = await Scrap.findById(id);
        if (!scrap) {
            return res.status(404).json({ message: 'Scrap item not found' });
        }

        // Update the scrap item
        const updatedScrap = await Scrap.findByIdAndUpdate(id, {
            name,
            description,
            category,
            location,
            status,
            images
        }, { new: true });

        res.status(200).json(updatedScrap);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', details: error.message });
    }
};

// @desc Delete a scrap item by ID
// @route DELETE /api/scrap/:id
// @access Private (Admin only)
exports.deleteScrapItemById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    try {
        // Check if the user exists
        const user = await checkUserExists(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the scrap item exists
        const scrap = await Scrap.findByIdAndDelete(id);
        if (!scrap) {
            return res.status(404).json({ message: 'Scrap item not found' });
        }

        res.status(200).json({ message: 'Scrap item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', details: error.message });
    }
};

// @desc Get scrap items by status
// @route GET /api/scrap/status/:status
// @access Public
exports.getScrapItemsByStatus = async (req, res) => {
    const { status } = req.params;

    try {
        const scraps = await Scrap.find({ 'status.type': status });
        res.status(200).json(scraps);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', details: error.message });
    }
};

// @desc Get scrap items by category
// @route GET /api/scrap/category/:categoryType
// @access Public
exports.getScrapItemsByCategory = async (req, res) => {
    const { categoryType } = req.params;

    try {
        const scraps = await Scrap.find({ 'category.type': categoryType });
        res.status(200).json(scraps);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', details: error.message });
    }
};

// @desc Get scrap items by location
// @route GET /api/scrap/location/:locationType
// @access Public
exports.getScrapItemsByLocation = async (req, res) => {
    const { locationType } = req.params;

    try {
        const scraps = await Scrap.find({ 'location.type': locationType });
        res.status(200).json(scraps);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', details: error.message });
    }
};

// @desc Search scrap items by description
// @route GET /api/scrap/search
// @access Public
exports.searchScrapItemsByDescription = async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    try {
        const scraps = await Scrap.find({ description: new RegExp(q, 'i') });
        res.status(200).json(scraps);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', details: error.message });
    }
};

// @desc Update the status of a scrap item by ID
// @route PATCH /api/scrap/status/:id/:status
// @access Private (Admin/Manager)
exports.updateScrapItemStatus = async (req, res) => {
    const { id, status } = req.params;
    const userId = req.user.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    try {
        // Check if the user exists
        const user = await checkUserExists(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the scrap item exists
        const scrap = await Scrap.findByIdAndUpdate(id, {
            'status.type': status
        }, { new: true });

        if (!scrap) {
            return res.status(404).json({ message: 'Scrap item not found' });
        }

        res.status(200).json(scrap);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', details: error.message });
    }
};

// @desc Get scrap items with pagination
// @route GET /api/scrap?page=1&limit=10
// @access Public
exports.getScrapItemsWithPagination = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
        return res.status(400).json({ message: 'Page and limit must be positive integers' });
    }

    try {
        const scraps = await Scrap.find()
            .skip((page - 1) * limit)
            .limit(limit);
        res.status(200).json(scraps);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', details: error.message });
    }
};

// @desc Get scrap item count by status
// @route GET /api/scrap/count/status
// @access Private (Admin/Manager)
exports.getScrapItemCountByStatus = async (req, res) => {
    try {
        const counts = await Scrap.aggregate([
            { $group: { _id: "$status.type", count: { $sum: 1 } } }
        ]);
        res.status(200).json(counts);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', details: error.message });
    }
};

// @desc Get scrap items with sorting
// @route GET /api/scrap/sort?field=name&order=asc
// @access Public
exports.getScrapItemsWithSorting = async (req, res) => {
    const field = req.query.field || 'name';
    const order = req.query.order === 'desc' ? -1 : 1;

    const validFields = ['name', 'status', 'category', 'location'];

    if (!validFields.includes(field)) {
        return res.status(400).json({ message: 'Invalid sort field' });
    }

    try {
        const scraps = await Scrap.find().sort({ [field]: order });
        res.status(200).json(scraps);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', details: error.message });
    }
};
