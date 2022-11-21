const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const commentSchema = new mongoose.Schema(
    {
        comment: {
            type: String,
        },
        postId: {
            type: ObjectId,
            ref: 'Blog',
            required: true
        },
        name: {
            type: String
        },
        approved: {
            type: String,
            default: "no"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);