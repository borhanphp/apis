const mongoose = require('mongoose');

const homeMiddleSecAdsSchema = mongoose.Schema({
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


module.exports = homeMiddleSecAdsModel = mongoose.model('homeMiddleSecAdsModel', homeMiddleSecAdsSchema, 'Home Middle Second Ads');