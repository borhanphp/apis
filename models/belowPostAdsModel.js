const mongoose = require('mongoose');

const belowPostAdsSchema = mongoose.Schema({
    name: {
        type: String,
        required: false
    },

    url: {
        type: String,
        required: false
    },

    image:{
        data: Buffer,
        contentType: String
    }
}, { timestamps: true }
);


module.exports = belowPostAdsModel = mongoose.model('belowPostAdsModel', belowPostAdsSchema, 'Below Post Ads');