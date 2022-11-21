const mongoose = require('mongoose');

const topBannerSchema = mongoose.Schema({
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


module.exports = topRightModel = mongoose.model('topRightModel', topBannerSchema, 'Top Banner');