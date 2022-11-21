const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true
        },
        email: {
            type: String,
        },
        body: {
            type: {},
            required: true
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('About', aboutSchema);