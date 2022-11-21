const mongoose = require('mongoose');

const socialLinkSchema = mongoose.Schema({
    facebook: {
        type: String,
        required: false
    },

    twitter: {
        type: String,
        required: false
    },

    instagram: {
        type: String,
        required: false
    },

    youtube: {
        type: String,
        required: false
    },

    linkedin: {
        type: String,
        required: false
    },

    image:{
        data: Buffer,
        contentType: String,
        required: false
    }
}, { timestamps: true });


module.exports = socialLinkModel = mongoose.model('socialLinkModel', socialLinkSchema, 'social links');