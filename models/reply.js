const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const replySchema = new mongoose.Schema(
    {
        reply: {
            type: String,
        },
        commentId: {
            type: ObjectId,
            ref: 'Comment',
            required: true
        },
        name: {
            type: String
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Reply', replySchema);