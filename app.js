const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./Util/wrapAsync.js");
const ExpressErr = require("./Util/ExpressErr.js");
const {listingSchema, reviewSchema} = require("./schema.js");

const Review = require("./models/review.js");


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

// Listing Validation Function
const validatListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressErr(400, errMsg);
    } else {
        next();
    }
}

// Review validation Function
const validatReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressErr(400, errMsg);
    } else {
        next();
    }
}



// Index Rout
app.get("/listing", wrapAsync(async(req, res, next) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings}); 
}));


// New Rout
app.get("/listing/new", (req, res) => {
    res.render("listings/new.ejs");
});

// show rout
app.get(
    "/listing/:id", 
    wrapAsync(async(req, res, next) => {
        let {id} = req.params;
        let listing = await Listing.findById(id).populate("reviews");
        res.render("listings/show.ejs", {listing});
}));


// create rout
app.post("/listing", 
    validatListing,
    wrapAsync(async (req, res, next) => {
    // let {title, description, image, price, country, location} = req.body;
    // let listing = req.body.listing;
    // if(!req.body.listing) {
    //     throw new ExpressErr(400, "Send valid data for listing");
    // }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing"); 
}));


// Edit rout
app.get("/listing/:id/edit", wrapAsync(async(req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));


// Update rout
app.put("/listing/:id",
    validatListing,
    wrapAsync(async (req, res, next) => {
    // if(!req.body.listing) {
    //     throw new ExpressErr(400, "Send valid data for listing")
    // } === > validatListing
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listing/${id}`);
}));



// Delete Rout
app.delete("/listing/:id", wrapAsync(async (req, res, next) => {
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect(`/listing`);
}));



// Reviews - Post Rout
app.post("/listing/:id/reviews", validatReview, wrapAsync(async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listing/${listing._id}`);
}));


// Delete -Review Route
app.post("/listing/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`listing/${id}`);
}));


app.get("/", (req, res) => {
    res.send("Hi, I am root");
});


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





// app.get("/testListing", async (req, res) => {
    //     let sampleListing = new Listing({
    //         title: "My new Villa",
    //         description: "By the beach",
    //         price: 1200,
    //         location: "Calangute, Goa",
    //         country: "India"
    //     });
    //     await sampleListing.save();
    //     console.log("sample was saved");
    //     res.send("Sucessfull Testing");
    // });