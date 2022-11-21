const mongoose = require('mongoose');

const advertiseSchema = mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    link: {
        type: String,
        required: false
    },
    alt: {
        type: String,
        required: false
    },
    position: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false

    },
    view: {
        type: String,
        required: false

    },
    photo:{
        type: String,
    }
}, { timestamps: true }

);


module.exports = Ads = mongoose.model('Ads',advertiseSchema);