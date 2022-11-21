const mongoose = require('mongoose');

const editorSchema = new mongoose.Schema(
    {
        title: {
            type: String
        },
        name: {
            type: String
        },
        email: {
            type: String,
        },
        body: {
            type: {},
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Editor', editorSchema);