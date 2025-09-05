const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user);
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;

    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You do not have permission to do that");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    console.dir(req.body, { depth: null });

    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map( (el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    console.dir(req.body, { depth: null });

    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map( (el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You do not have permission to delete this review.");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.checkCategoryResults = async(req, res, next) => {
    try{
        const { category } = req.query;
        if(category) {
            const listings = await Listing.find({ category });

            if(listings.length === 0 ) {
                req.flash("error", "No listings found for this category");
                return res.redirect("/listings");
            }
        }
        next();
    } catch (error) {
        next(error);
    }
};