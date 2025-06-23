const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressErr = require("./Util/ExpressErr.js");
const Review = require("./models/review.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

const session = require("express-session");
const flash = require("connect-flash");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust2');
}


main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret : "MySuperSeceretCode", // fixed typo here
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
}

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});


app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/listing", listings);
app.use("/listing/:id/reviews", reviews);



app.all("*", (req, res, next) => {
    next(new ExpressErr(404, "Page Not Found!"));
});


// For error handling middleware are create by async error
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong!!"} = err;
    res.status(statusCode).render("error.ejs", {err});
    // res.status(statusCode).send(message);
});


app.listen(8080, () => {
    console.log("server is listening to port 8080")
});

