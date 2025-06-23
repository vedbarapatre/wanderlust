const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require("../Util/wrapAsync.js");
const ExpressErr = require("../Util/ExpressErr.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { reviewSchema} = require("../schema.js");

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


// Reviews - Post Rout
router.post(
    "/", 
    validatReview, 
    wrapAsync(async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Add Successfully!"); 
    res.redirect(`/listing/${listing._id}`);
}));


// Delete -Review Route
router.delete(
    "/:reviewId", 
    wrapAsync(async (req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted Successfully!");
    res.redirect(`/listing/${id}`);
}));


module.exports = router;