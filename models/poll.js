const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const pollSchema = new mongoose.Schema(
    {
        title: {
            type: String
        },
        body: {
            type: String
        },
        photo: {
            type: String
        },
        yes: {
            type: Number,
            default: 0
        },
        no: {
            type: Number,
            default: 0
        },
        nocomments: {
            type: Number,
            default: 0
        },
        show: {
            type: String,
            default: "published"
        },

        view: {
            type: String,
            default: "bangla"
        },

    },
    { timestamps: true }
);

module.exports = mongoose.model('Poll', pollSchema);
