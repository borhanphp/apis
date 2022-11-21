const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const videoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            min: 3,
            max: 160,
            required: true
        },
        slug: {
            type: String,
            unique: true,
            index: true
        },
        videoid: {
            type: String,
        },
        body: {
            type: {},
            required: true,
            min: 200,
            max: 2000000
        },
        view: {
            type: String,
            default: "bangla"
        },
        mtitle: {
            type: String
        },
        mdesc: {
            type: String
        },
        photo: {
            type: String
        },
        status: {
            type: String,
            default: "published"
        },
        count: {
            type: Number,
            default: "0"
        },
        postedBy: {
            type: ObjectId,
            ref: 'User'
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Video', videoSchema);
