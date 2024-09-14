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

/**
 * @swagger
 * /api/scrap:
 *   post:
 *     summary: Create a new scrap item with images
 *     description: Creates a new scrap item in the database.
 *     tags:
 *       - Scrap Items
 *     requestBody:
 *       description: Scrap item data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               weight:
 *                 type: number
 *               category:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [metal, plastic, electronic, other]
 *                   details:
 *                     type: object
 *                     properties:
 *                       sub_category:
 *                         type: string
 *                       classification:
 *                         type: string
 *               status:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [unprocessed, sorted, ready_for_auction, recycled]
 *                   details:
 *                     type: object
 *                     properties:
 *                       reason:
 *                         type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [warehouse, recycling_center, auction_house]
 *                   details:
 *                     type: object
 *                     properties:
 *                       address:
 *                         type: string
 *                       warehouse_section:
 *                         type: string
 *               received_by:
 *                 type: string
 *                 format: uuid
 *               sorted_by:
 *                 type: string
 *                 format: uuid
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Scrap item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/ScrapItem'
 *       400:
 *         description: Validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 details:
 *                   type: string
 */

// @desc Create a new scrap item
// @route POST /api/scrap
// @access Private (Auction Manager, System Admin, Super User)
router.post('/', protect, authorize('auction_manager', 'system_admin', 'super_user'), createScrapItem);


/**
 * @swagger
 * /api/scrap:
 *   get:
 *     summary: Get all scrap items
 *     description: Retrieves a list of all scrap items.
 *     tags:
 *       - Scrap Items
 *     responses:
 *       200:
 *         description: List of scrap items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ScrapItem'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 details:
 *                   type: string
 */

// @desc Get all scrap items
// @route GET /api/scrap
// @access Public
router.get('/', getAllScrapItems);

/**
 * @swagger
 * /api/scrap/{id}:
 *   get:
 *     summary: Get a single scrap item by ID
 *     description: Retrieves a scrap item by its ID.
 *     tags:
 *       - Scrap Items
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the scrap item
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Scrap item details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScrapItem'
 *       400:
 *         description: Invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Scrap item not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 details:
 *                   type: string
 */
// @desc Get a single scrap item by ID
// @route GET /api/scrap/:id
// @access Public
router.get('/:id', getScrapItemById);

/**
 * @swagger
 * /api/scrap/{id}:
 *   put:
 *     summary: Update a scrap item by ID with images
 *     description: Updates the details of a scrap item including images.
 *     tags:
 *       - Scrap Items
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the scrap item to update
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       description: Updated scrap item data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               weight:
 *                 type: number
 *               category:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [metal, plastic, electronic, other]
 *                   details:
 *                     type: object
 *                     properties:
 *                       sub_category:
 *                         type: string
 *                       classification:
 *                         type: string
 *               status:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [unprocessed, sorted, ready_for_auction, recycled]
 *                   details:
 *                     type: object
 *                     properties:
 *                       reason:
 *                         type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [warehouse, recycling_center, auction_house]
 *                   details:
 *                     type: object
 *                     properties:
 *                       address:
 *                         type: string
 *                       warehouse_section:
 *                         type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Scrap item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScrapItem'
 *       400:
 *         description: Invalid ID format or validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: Scrap item or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 details:
 *                   type: string
 */
// @desc Update a scrap item by ID
// @route PUT /api/scrap/:id
// @access Private (Auction Manager, System Admin, Super User)
router.put('/:id', protect, authorize('auction_manager', 'system_admin', 'super_user'), updateScrapItemById);


/**
 * @swagger
 * /api/scrap/{id}:
 *   delete:
 *     summary: Delete a scrap item by ID
 *     description: Deletes a scrap item from the database.
 *     tags:
 *       - Scrap Items
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the scrap item to delete
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Scrap item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Scrap item or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 details:
 *                   type: string
 */
// @desc Delete a scrap item by ID
// @route DELETE /api/scrap/:id
// @access Private (System Admin, Super User)
router.delete('/:id', protect, authorize('system_admin', 'super_user'), deleteScrapItemById);


/**
 * @swagger
 * /api/scrap/status/{status}:
 *   get:
 *     summary: Get scrap items by status
 *     description: Retrieves scrap items that match the specified status.
 *     tags:
 *       - Scrap Items
 *     parameters:
 *       - name: status
 *         in: path
 *         description: Status of the scrap items
 *         required: true
 *         schema:
 *           type: string
 *           enum: [unprocessed, sorted, ready_for_auction, recycled]
 *     responses:
 *       200:
 *         description: List of scrap items with the specified status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ScrapItem'
 *       400:
 *         description: Invalid status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 details:
 *                   type: string
 */
// @desc Get scrap items by status
// @route GET /api/scrap/status/:status
// @access Public
router.get('/status/:status', getScrapItemsByStatus);



/**
 * @swagger
 * /api/scrap/category/{category}:
 *   get:
 *     summary: Get scrap items by category
 *     description: Retrieves scrap items that match the specified category.
 *     tags:
 *       - Scrap Items
 *     parameters:
 *       - name: category
 *         in: path
 *         description: Category of the scrap items
 *         required: true
 *         schema:
 *           type: string
 *           enum: [metal, plastic, electronic, other]
 *     responses:
 *       200:
 *         description: List of scrap items with the specified category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ScrapItem'
 *       400:
 *         description: Invalid category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 details:
 *                   type: string
 */
// @desc Get scrap items by category
// @route GET /api/scrap/category/:categoryType
// @access Public
router.get('/category/:categoryType', getScrapItemsByCategory);


/**
 * @swagger
 * /api/scrap/location/{location}:
 *   get:
 *     summary: Get scrap items by location
 *     description: Retrieves scrap items that are located in the specified location.
 *     tags:
 *       - Scrap Items
 *     parameters:
 *       - name: location
 *         in: path
 *         description: Location of the scrap items
 *         required: true
 *         schema:
 *           type: string
 *           enum: [warehouse, recycling_center, auction_house]
 *     responses:
 *       200:
 *         description: List of scrap items in the specified location
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ScrapItem'
 *       400:
 *         description: Invalid location
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 details:
 *                   type: string
 */
// @desc Get scrap items by location
// @route GET /api/scrap/location/:locationType
// @access Public
router.get('/location/:locationType', getScrapItemsByLocation);

/**
 * @swagger
 * /api/scrap/search:
 *   get:
 *     summary: Search scrap items by description
 *     description: Retrieves scrap items that match the search criteria in the description.
 *     tags:
 *       - Scrap Items
 *     parameters:
 *       - name: query
 *         in: query
 *         description: Search term for scrap item description
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of scrap items matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ScrapItem'
 *       400:
 *         description: Invalid search query
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 details:
 *                   type: string
 */
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

/**
 * @swagger
 * /api/scrap/count:
 *   get:
 *     summary: Get the count of scrap items by status
 *     description: Retrieves the count of scrap items categorized by their status.
 *     tags:
 *       - Scrap Items
 *     responses:
 *       200:
 *         description: Count of scrap items by status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 unprocessed:
 *                   type: integer
 *                 sorted:
 *                   type: integer
 *                 ready_for_auction:
 *                   type: integer
 *                 recycled:
 *                   type: integer
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 details:
 *                   type: string
 */
// @desc Get scrap item count by status
// @route GET /api/scrap/count/status
// @access Private (Auction Manager, System Admin, Super User)
router.get('/count/status', protect, authorize('auction_manager', 'system_admin', 'super_user'), getScrapItemCountByStatus);

// @desc Get scrap items with sorting
// @route GET /api/scrap/sort
// @access Public
router.get('/sort', getScrapItemsWithSorting);

module.exports = router;



