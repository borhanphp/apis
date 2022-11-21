const mongoose = require('mongoose');

const homeMiddleFirstAdsSchema = mongoose.Schema({
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
}, { timestamps: true });


module.exports = homeMiddleFirstAdsModel = mongoose.model('homeMiddleFirstAdsModel', homeMiddleFirstAdsSchema, 'Home Middle First Ads');