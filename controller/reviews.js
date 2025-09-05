const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);                 //fetching the listing in which review is added (find by id)
    let newReview = new Review(req.body.review);                                     //fetching review from the request body
    newReview.author = req.user._id; // set the author to the current logged-in user
    await newReview.save();

    listing.reviews.push(newReview._id);
    
    await listing.save();

    console.log("new review saved");
    req.flash("success", "New Review added !!");
    res.redirect(`/listings/${listing._id}`); //redirecting to the listing page after adding the review
};

module.exports.destroyReview = async (req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted !!");
    res.redirect(`/listings/${id}`);
};
