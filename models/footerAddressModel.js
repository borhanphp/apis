const mongoose = require('mongoose');

const FooterAddressSchema = mongoose.Schema({
    address: {
        type: String,
        required: false
    }

}, { timestamps: true });


module.exports = footerAddressModel = mongoose.model('footerAddressModel', FooterAddressSchema, 'footer address');