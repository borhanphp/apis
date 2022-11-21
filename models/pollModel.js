const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const pollSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            min: 3,
            max: 160,
            required: false
        },
        body: {
            type: {},
            required: false,
            min: 200,
            max: 2000000
        },
        photo: {
            data: Buffer,
            contentType: String
        },
        option1: [
            {
                id: {type: Number, default: 0},
                votes:{type: Number, default: 0},
                option:{type:String, default: "হ্যা"} 
            }
        ],
        option2: [
            {
                id: {type: Number, default: 1},
                votes:{type: Number, default: 0},
                option:{type:String, default: "না"} 
            }
        ],

        option3: [
            {
                id: {type: Number, default: 2},
                votes:{type: Number, default: 0},
                option:{type:String, default: "মন্তব্য নাই"} 
            }
        ],

    },
    { timestamps: true }
);

module.exports = mongoose.model('Poll', pollSchema);
