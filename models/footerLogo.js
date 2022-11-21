const mongoose = require('mongoose');

const FooterLogoSchema = mongoose.Schema({
    name: {
        type: String,
        required: false
    },

    image:{
        data: Buffer,
        contentType: String
    }
}, { timestamps: true });


module.exports = footerLogoModel = mongoose.model('footerLogoModel', FooterLogoSchema, 'footer logo');