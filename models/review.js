// const { string } = require("joi");
const mongoose = require("mongoose");
// const { create } = require("./listing");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    Comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Review", reviewSchema);

