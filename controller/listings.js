const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');   //require the geocoding service
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });    //create a client

module.exports.index = async (req,res ) => {
    const { category } = req.query;
    let allListings = [];
    if(category) {
        allListings = await Listing.find({category});
    } else {
        allListings = await Listing.find({});
    }
    let noResults= false;
    if(allListings.length === 0) {
        noResults = true;
    }
    res.render("listings/index.ejs", {allListings, category, noResults});
};

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
};

module.exports.createListing = async (req,res) => {
    let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1
    })
    .send();

    
    let url = req.file.path;
    let filename = req.file.filename;

     //create a new listing and save it to the db
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // set the owner to the current logged-in user
    newListing.image = { url, filename }; 
    newListing.geometry =  response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing created successfully !!");
    res.redirect("/listings");
};

module.exports.showListing = async (req,res) => {
    let { id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing) {
        req.flash("error", "listing not found");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});

};

module.exports.renderEditForm = async (req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    // console.log(listing);
    if(!listing) {
        req.flash("error", "listing not found");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    
    res.render("listings/edit.ejs", {listing, originalImageUrl});
};

module.exports.updateListing = async (req,res) => {
    
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing}, {new: true})

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing updated !!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res) => {
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted !!");
    res.redirect("/listings");

};