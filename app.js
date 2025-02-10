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
const { listingSchema } = require("./schema.js")
const Review = require("./models/review.js");
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


//Index Rought
app.get("/listings", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("./listings/index.ejs", {allListing});
}));

//New Route
app.get("/listings/new", wrapAsync(  (req, res) => {
    res.render("./listings/new.ejs");
}));

//show route
app.get("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs", {listing});
}));

//Create Route
app.post("/listings", validateListing, wrapAsync( async (req, res, next) => {
    const newListing = new Listing(req.body.listings);
    await newListing.save();
    res.redirect("/listings");
    // console.log(req.body.listings);
}));

//edit route
app.get("/listings/:id/edit",validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", {listing});
}));

//update route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params; 
    await Listing.findByIdAndUpdate(id,req.body.listings);
    res.redirect(`/listings/${id}`);
}));

app.delete("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


//Review
//Post Route
app.post("/listings/:id/reviews", async (req, res)=> {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.review.push(newReview);

    await newReview.save();
    await listing.save();
    res.send("new review saved");
});


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