const Scrap = require('../models/scrapModel');

// @desc Create a new scrap item
// @route POST /api/scrap
// @access Private (Admin/Manager)
exports.createScrapItem = async (req, res) => {
    try {
        const newScrap = await Scrap.create(req.body);
        res.status(201).json(newScrap);
    } catch (error) {
        res.status(400).json({ message: error.message });
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
        res.status(400).json({ message: error.message });
    }
};

// @desc Get a single scrap item by ID
// @route GET /api/scrap/:id
// @access Public
exports.getScrapItemById = async (req, res) => {
    try {
        const scrap = await Scrap.findById(req.params.id);
        if (!scrap) {
            return res.status(404).json({ message: 'Scrap item not found' });
        }
        res.status(200).json(scrap);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc Update a scrap item by ID
// @route PUT /api/scrap/:id
// @access Private (Admin/Manager)
exports.updateScrapItemById = async (req, res) => {
    try {
        const scrap = await Scrap.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!scrap) {
            return res.status(404).json({ message: 'Scrap item not found' });
        }
        res.status(200).json(scrap);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc Delete a scrap item by ID
// @route DELETE /api/scrap/:id
// @access Private (Admin only)
exports.deleteScrapItemById = async (req, res) => {
    try {
        const scrap = await Scrap.findByIdAndDelete(req.params.id);
        if (!scrap) {
            return res.status(404).json({ message: 'Scrap item not found' });
        }
        res.status(200).json({ message: 'Scrap item deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc Get scrap items by status
// @route GET /api/scrap/status/:status
// @access Public
exports.getScrapItemsByStatus = async (req, res) => {
    try {
        const scraps = await Scrap.find({ status: req.params.status });
        res.status(200).json(scraps);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc Get scrap items by category
// @route GET /api/scrap/category/:categoryType
// @access Public
exports.getScrapItemsByCategory = async (req, res) => {
    try {
        const scraps = await Scrap.find({ category: req.params.categoryType });
        res.status(200).json(scraps);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc Get scrap items by location
// @route GET /api/scrap/location/:locationType
// @access Public
exports.getScrapItemsByLocation = async (req, res) => {
    try {
        const scraps = await Scrap.find({ location: req.params.locationType });
        res.status(200).json(scraps);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc Search scrap items by description
// @route GET /api/scrap/search
// @access Public
exports.searchScrapItemsByDescription = async (req, res) => {
    try {
        const query = req.query.q;
        const scraps = await Scrap.find({ description: new RegExp(query, 'i') });
        res.status(200).json(scraps);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc Update the status of a scrap item by ID
// @route PATCH /api/scrap/status/:id/:status
// @access Private (Admin/Manager)
exports.updateScrapItemStatus = async (req, res) => {
    try {
        const scrap = await Scrap.findByIdAndUpdate(req.params.id, { status: req.params.status }, { new: true });
        if (!scrap) {
            return res.status(404).json({ message: 'Scrap item not found' });
        }
        res.status(200).json(scrap);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc Get scrap items with pagination
// @route GET /api/scrap?page=1&limit=10
// @access Public
exports.getScrapItemsWithPagination = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const scraps = await Scrap.find()
            .skip((page - 1) * limit)
            .limit(limit);
        res.status(200).json(scraps);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc Get scrap item count by status
// @route GET /api/scrap/count/status
// @access Private (Admin/Manager)
exports.getScrapItemCountByStatus = async (req, res) => {
    try {
        const counts = await Scrap.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        res.status(200).json(counts);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc Get scrap items with sorting
// @route GET /api/scrap/sort?field=name&order=asc
// @access Public
exports.getScrapItemsWithSorting = async (req, res) => {
    try {
        const field = req.query.field || 'name';
        const order = req.query.order === 'desc' ? -1 : 1;
        const scraps = await Scrap.find().sort({ [field]: order });
        res.status(200).json(scraps);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
