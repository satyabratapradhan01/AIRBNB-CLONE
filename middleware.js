module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.flash("success", "you must be login to creat listing");
        return res.redirect("/login")
    }
    next();
}