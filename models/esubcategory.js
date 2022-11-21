const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const esubCategorySchema = new mongoose.Schema(
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
        ecategory: [{
            type: ObjectId,
            ref: 'Ecategory',
            required: false
        }],
        show: {
            type: String
        }
    },
    { timestamp: true }
);

module.exports = mongoose.model('Esubcategory', esubCategorySchema);