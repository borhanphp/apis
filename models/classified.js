const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const Schema = mongoose.Schema;

const classifiedSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: false
    },
    show: {
        type: String,
    },

    slug: {
        type: String,
    },
   language: {

        type: String
    },
    category: {
        type: ObjectId,
        ref: 'Category',
        required: true
    },
}, {timestamps: true}
);


module.exports = mongoose.model('Classified', classifiedSchema);