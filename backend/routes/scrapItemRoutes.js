const express = require('express');
const router = express.Router();
const {
    createScrapItem,
    getAllScrapItems,
    getScrapItemById,
    updateScrapItemById,
    deleteScrapItemById,
    getScrapItemsByStatus,
    getScrapItemsByCategory,
    getScrapItemsByLocation,
    searchScrapItemsByDescription,
    updateScrapItemStatus,
    getScrapItemsWithPagination,
    getScrapItemCountByStatus,
    getScrapItemsWithSorting
} = require('../controllers/scrapItemController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// @desc Create a new scrap item
// @route POST /api/scrap
// @access Private (Auction Manager, System Admin, Super User)
router.post('/', protect, authorize('auction_manager', 'system_admin', 'super_user'), createScrapItem);

// @desc Get all scrap items
// @route GET /api/scrap
// @access Public
router.get('/', getAllScrapItems);

// @desc Get a single scrap item by ID
// @route GET /api/scrap/:id
// @access Public
router.get('/:id', getScrapItemById);

// @desc Update a scrap item by ID
// @route PUT /api/scrap/:id
// @access Private (Auction Manager, System Admin, Super User)
router.put('/:id', protect, authorize('auction_manager', 'system_admin', 'super_user'), updateScrapItemById);

// @desc Delete a scrap item by ID
// @route DELETE /api/scrap/:id
// @access Private (System Admin, Super User)
router.delete('/:id', protect, authorize('system_admin', 'super_user'), deleteScrapItemById);

// @desc Get scrap items by status
// @route GET /api/scrap/status/:status
// @access Public
router.get('/status/:status', getScrapItemsByStatus);

// @desc Get scrap items by category
// @route GET /api/scrap/category/:categoryType
// @access Public
router.get('/category/:categoryType', getScrapItemsByCategory);

// @desc Get scrap items by location
// @route GET /api/scrap/location/:locationType
// @access Public
router.get('/location/:locationType', getScrapItemsByLocation);

// @desc Search scrap items by description
// @route GET /api/scrap/search
// @access Public
router.get('/search', searchScrapItemsByDescription);

// @desc Update the status of a scrap item by ID
// @route PATCH /api/scrap/status/:id/:status
// @access Private (Auction Manager, System Admin, Super User)
router.patch('/status/:id/:status', protect, authorize('auction_manager', 'system_admin', 'super_user'), updateScrapItemStatus);

// @desc Get scrap items with pagination
// @route GET /api/scrap/page
// @access Public
router.get('/page', getScrapItemsWithPagination);

// @desc Get scrap item count by status
// @route GET /api/scrap/count/status
// @access Private (Auction Manager, System Admin, Super User)
router.get('/count/status', protect, authorize('auction_manager', 'system_admin', 'super_user'), getScrapItemCountByStatus);

// @desc Get scrap items with sorting
// @route GET /api/scrap/sort
// @access Public
router.get('/sort', getScrapItemsWithSorting);

module.exports = router;
