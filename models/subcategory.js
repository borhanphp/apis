const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const subCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: false,
            max: 32
        },
        slug: {
            type: String,
            unique: true,
            index: true
        },
        category: [{
            type: ObjectId,
            ref: 'Category',
            required: false
        }],
        show: {
            type: String
        }
    },
    { timestamp: true }
);

module.exports = mongoose.model('Subcategory', subCategorySchema);