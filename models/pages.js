const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pagesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: false
    },
    slug: {
        type: String,
    },
    show: {
        type: String
    },
    footer: {
        type: String
    },
    header: {
        type: String
    },
    statusofpage: {
        type: String
    }
}, {timestamps: true}
);


module.exports = mongoose.model('Pages', pagesSchema);