const mongoose = require('mongoose');

const ecategorySchema = new mongoose.Schema(
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
        }
    },
    { timestamp: true }
);

module.exports = mongoose.model('Ecategory', ecategorySchema);