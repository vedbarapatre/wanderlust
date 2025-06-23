const express = require('express');
const router = express.Router();
const wrapAsync = require("../Util/wrapAsync.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const ExpressErr = require("../Util/ExpressErr.js");
const Listing = require("../models/listing.js");

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

// Index Rout
router.get(
    "/", 
    wrapAsync(async(req, res, next) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings}); 
}));


// New Rout
router.get(
    "/new", (req, res) => {
    res.render("listings/new.ejs");
});

// show rout
router.get(
    "/:id", 
    wrapAsync(async(req, res, next) => {
        let {id} = req.params;
        let listing = await Listing.findById(id).populate("reviews");
        if(!listing) {
            req.flash("error", "Listing You requested for does Not Exist!!");
            res.redirect("/listing");
        }
        res.render("listings/show.ejs", {listing});
}));

// create rout
router.post(
    "/", 
    validatListing,
    wrapAsync(async (req, res, next) => {
    // let {title, description, image, price, country, location} = req.body;
    // let listing = req.body.listing;
    // if(!req.body.listing) {
    //     throw new ExpressErr(400, "Send valid data for listing");
    // }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created Successfully!");
    res.redirect("/listing"); 
}));


// Edit rout
router.get(
    "/:id/edit",
    wrapAsync(async(req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing) {
            req.flash("error", "Listing You requested for does Not Exist!!");
            res.redirect("/listing");
        }
    res.render("listings/edit.ejs", {listing});
}));


// Update rout
router.put(
    "/:id",
    validatListing,
    wrapAsync(async (req, res, next) => {
    // if(!req.body.listing) {
    //     throw new ExpressErr(400, "Send valid data for listing")
    // } === > validatListing
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listing/${id}`);
}));



// Delete Rout
router.delete(
    "/:id", 
    wrapAsync(async (req, res, next) => {
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect(`/listing`);
}));

module.exports = router;