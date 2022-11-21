const mongoose = require('mongoose');

const homeMiddleLongAdsSchema = mongoose.Schema({
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


module.exports = homeMiddleLongAdsModel = mongoose.model('homeMiddleLongAdsModel', homeMiddleLongAdsSchema, 'Home Middle Ads');