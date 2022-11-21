const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const blogSchema = new mongoose.Schema(
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
        body: {
            type: {},
            required: true,
            min: 200,
            max: 2000000
        },
        excerpt: {
            type: String,
            max: 1000
        },
        mtitle: {
            type: String
        },
        mdesc: {
            type: String
        },
        photo: {
            
            type: String,
        },
        categories: [{ type: ObjectId, ref: 'Category', required: true }],
        subcategories: [{ type: ObjectId, ref: 'Subcategory', required: false }],
        tags: [{ type: ObjectId, ref: 'Tag', required: false }],
        postedBy: {
            type: ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            default: "published"
        },
        featured: {
            type: String,
            default: "no"
        },
        scrol: {
            type: String,
            default: "no"
        },
        count: {
            type: Number,
            default: "0"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);