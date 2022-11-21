const mongoose = require('mongoose');

const homeRightAdsSchema = mongoose.Schema({
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


module.exports = homeRightAdsModel = mongoose.model('homeRightAdsModel', homeRightAdsSchema, 'Home Right Ads');