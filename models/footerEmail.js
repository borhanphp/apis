const mongoose = require('mongoose');

const FooterEmailSchema = mongoose.Schema({
    email: {
        type: String,
        required: false
    }

}, { timestamps: true });


module.exports = FooterEmail = mongoose.model('FooterEmail', FooterEmailSchema, 'footer email');