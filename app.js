const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require("express-session");


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

app.use("/listings", listings);

app.use("/listings/:id/reviews", reviews);


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let {statusCode=500, message= "Somthing went wrong!"} = err;
    res.status(statusCode).render("./listings/error.ejs", { message });
});

app.listen(port, ()=>{
    console.log(`server is litening the ${port}`);
});