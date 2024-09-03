const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema for category details of scrap items
const categorySchema = new Schema({
    type: {
        type: String,
        enum: ['metal', 'plastic', 'electronic', 'other'], // Specifies the type of scrap
        required: true
    },
    details: {
        sub_category: {
            type: String, // Sub-category within the main category
            default: null
        },
        classification: {
            type: String, // Additional classification, such as 'ferrous' or 'non-ferrous'
            default: null
        }
    }
}, { _id: false }); // Exclude _id field for sub-documents

// Schema for status details of scrap items
const statusSchema = new Schema({
    type: {
        type: String,
        enum: ['unprocessed', 'sorted', 'ready_for_auction', 'recycled'], // Specifies the status of the scrap
        required: true
    },
    details: {
        reason: {
            type: String, // Reason for the current status, e.g., 'awaiting inspection'
            default: null
        }
    }
}, { _id: false }); // Exclude _id field for sub-documents

// Schema for location details of scrap items
const locationSchema = new Schema({
    type: {
        type: String,
        enum: ['warehouse', 'recycling_center', 'auction_house'], // Specifies the type of location
        required: true
    },
    details: {
        address: {
            type: String, // Full address of the location
            required: true
        },
        warehouse_section: {
            type: String, // Specific section within a warehouse, e.g., 'section A'
            default: null
        }
    }
}, { _id: false }); // Exclude _id field for sub-documents

// Main schema for scrap items
const scrapItemSchema = new Schema({
    description: {
        type: String,
        required: true // Description of the scrap item
    },
    weight: {
        type: Number,
        required: true // Weight of the scrap item
    },
    category: {
        type: categorySchema,
        required: true // Embedded document for category details
    },
    status: {
        type: statusSchema,
        required: true // Embedded document for status details
    },
    location: {
        type: locationSchema,
        required: true // Embedded document for location details
    },
    received_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the User model for the person who received the scrap
        required: true
    },
    sorted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the User model for the person who sorted the scrap
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now // Automatically sets the date when the document is created
    },
    updated_at: {
        type: Date,
        default: Date.now, // Automatically sets the date when the document is updated
        set: function (val) {
            return val || Date.now; // Ensures the updated_at field is set to the current date if not provided
        }
    },
    images: {
        type: [String], // Array of image URLs
        default: [] // Default to an empty array
    }
});

// Creating the Mongoose model for scrap items
const ScrapItem = mongoose.model('ScrapItem', scrapItemSchema);

module.exports = ScrapItem;
