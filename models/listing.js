const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Convert image field to a single string
    default: "https://th.bing.com/th/id/OIP.mmctUHU6M-TA0a89ipHLfAHaEK?rs=1&pid=ImgDetMain",
    set: (v) => v || "https://th.bing.com/th/id/OIP.mmctUHU6M-TA0a89ipHLfAHaEK?rs=1&pid=ImgDetMain",
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;