// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const listingSchema = new Schema ({
//     title: {
//         type: String,
//         required: true
//     },
//     description: String,
//     image: {
//         type: String,
//         filename: String,
//         default: "https://unsplash.com/photos/the-sun-is-shining-through-the-trees-in-the-forest-KZwrFH42JCg",
//         set: (v) => 
//             v === "" 
//                 ? "https://unsplash.com/photos/the-sun-is-shining-through-the-trees-in-the-forest-KZwrFH42JCg"
//                 : v,
//     },
//     price: Number,
//     location: String,
//     country: String
// });

// const Listing = mongoose.model("Listing", listingSchema);
// module.exports = Listing;


const mongoose = require("mongoose");
const { types, ref } = require("joi");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema ({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews : [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        },
    ],
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
   
});

let Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;


