const express = require("express");
const app = express();
const session = require("express-session");
const falseConnect = require("connect-flash");
const path = require("path");



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOption = { 
    secret: "mysuppersecretstring", 
    resave: false, 
    saveUninitialized: true };

app.use(session(sessionOption));
app.use(falseConnect());


app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});



app.get("/register", (req, res) => {
    let { name = "satya don" } = req.query;
    req.session.name = name;
    if(name === "satya don"){
        req.flash("error", "user not register");
    }else{
        req.flash("success", "user register successfully");
    }
    res.redirect("/hello");
});

app.get("/hello", (req, res) => {
    res.render("page.ejs", {name: req.session.name});
});

app.listen(3000, () => {
    console.log("server is listening to 3000");
});