const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  
  description:  String,

  image: {
    type: String, // Convert image field to a single string
    default: "https://th.bing.com/th/id/OIP.mmctUHU6M-TA0a89ipHLfAHaEK?rs=1&pid=ImgDetMain",
    set: (v) => v || "https://th.bing.com/th/id/OIP.mmctUHU6M-TA0a89ipHLfAHaEK?rs=1&pid=ImgDetMain",
  },

  price: Number,
  location: String,
  country: String,

  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    }
  ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({_id: { $in: listing.review}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;