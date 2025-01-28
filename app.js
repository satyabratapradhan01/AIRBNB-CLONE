const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override")

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main().then(() =>{
    console.log("connected to DB")
})
.catch((err) =>{
    console.log(err)
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get("/", (req, res) => {
    res.send("Hi! I am root")
})

//Index Rought
app.get("/listings", async (req, res) => {
    const allListing = await Listing.find({});
    res.render("./listings/index.ejs", {allListing});
});

//New Route
app.get("/listings/new",  (req, res) => {
    res.render("./listings/new.ejs");
})

//show route
app.get("/listings/:id",async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs", {listing})
})

//Create Route
app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listings);
    await newListing.save();
    res.redirect("/listings")
})

//edit route
app.get("/listings/:id/edit", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", {listing});
})

//update route
app.put("/listings/:id?", async (req, res) => {
    const { id } = req.params; 
    await Listing.findByIdAndUpdate(id);
    res.redirect(`/listings`);
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

app.listen(port, ()=>{
    console.log(`server is litening the ${port}`)
})