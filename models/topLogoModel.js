const mongoose = require('mongoose');

const logoSchema = mongoose.Schema({
    name: {
        type: String,
        required: false
    },

    image:{
        data: Buffer,
        contentType: String
    }
}, { timestamps: true });


module.exports = topLogoModel = mongoose.model('topLogoModel', logoSchema, 'logo');