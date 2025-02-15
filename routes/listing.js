const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage });

const listingController = require("../controllers/listings.js");

//Index Rought
router.get("/", wrapAsync(listingController.index));


//New Route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

//show route
router.get("/:id", validateListing, wrapAsync(listingController.showListing));

//Create Route
router.post("/", isLoggedIn, upload.single("listings[image]"), validateListing, wrapAsync(listingController.creatListing));

//edit route
router.get("/:id/edit",validateListing, isLoggedIn, wrapAsync(listingController.renderEditForm));

//update route
router.put("/:id", isLoggedIn, isOwner, upload.single("listings[image]"),  validateListing, wrapAsync(listingController.updateListing));

//Delete Route
router.delete("/:id", isLoggedIn, wrapAsync(listingController.destroyListing));

module.exports = router;