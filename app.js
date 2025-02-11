const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js")
const Review = require("./models/review.js");
const listings = require("./routes/listing.js")
// const { console } = require("inspector");

main().then(() =>{
    console.log("connected to DB");
})
.catch((err) =>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", wrapAsync((req, res) => {
    res.send("Hi! I am root");
}));

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body.listing); // Use 'listing' instead of 'Listing'

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

const reviewListing = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body.listing);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


app.use("/listings", listings);


//Review
//Post Review Route
app.post("/listings/:id/reviews",reviewListing, wrapAsync(async (req, res)=> {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    const { id } = req.params; 
    listing.review.push(newReview);

    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
}));

//Delete Review Route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}));



// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute Goa",
//         country: "India"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing")
// });

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let {statusCode=500, message= "Somthing went wrong!"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("./listings/error.ejs", { message });
});

app.listen(port, ()=>{
    console.log(`server is litening the ${port}`);
});