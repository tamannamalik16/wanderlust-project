const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema( {
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        filename : String,
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set: (v) =>  v === "" ? "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v
        }  
    },
    price: Number,
    location: String,
    country: String,
    reviews: [{                                    // square bracket-> array-> bcz there can be multiple reviews
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner: {                                     // object to store single user, a listings is created by single user,not multiple
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],        // location.type must be a point
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    category: {
        type: String,
        enum: ["trending", "crafting", "boating",  "farms", "mountains", "iconic cities", "beaches","camping","arctic"],
        default: "trending",
        required: true
    }

});

listingSchema.post("findOneAndDelete", async (listing) =>  {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;