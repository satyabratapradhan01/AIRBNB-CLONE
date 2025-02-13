
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body.listing);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//Index Rought
router.get("/", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("./listings/index.ejs", {allListing});
}));


//New Route
router.get("/new", isLoggedIn , wrapAsync(  (req, res) => {
    res.render("listings/new.ejs");
}));

//show route
router.get("/:id", validateListing, wrapAsync(async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id).populate("review");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings")
    }
    res.render("./listings/show.ejs", {listing});
}));

//Create Route
router.post("/", validateListing, isLoggedIn, wrapAsync( async (req, res, next) => {
    const newListing = new Listing(req.body.listings);
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}));

//edit route
router.get("/:id/edit",validateListing, isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings")
    }
    res.render("./listings/edit.ejs", {listing});
}));

//update route
router.put("/:id", validateListing, isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params; 
    await Listing.findByIdAndUpdate(id,req.body.listings);
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;