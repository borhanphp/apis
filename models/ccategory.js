const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const ccategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            max: 32
        },
        slug: {
            type: String,
            unique: true,
            index: true
        },
        show: {
            type: String
        },
        language: {
            type: String
        },
    },
    { timestamp: true }
);

module.exports = mongoose.model('Ccrategory', ccategorySchema);