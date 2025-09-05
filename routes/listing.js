const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {  isLoggedIn , isOwner, validateListing, checkCategoryResults } = require("../middleware.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });      // dest is the destination folder for uploaded files temporarily

const listingController = require("../controller/listings.js");


//INDEX ROUTE
router.get("/", checkCategoryResults, wrapAsync(listingController.index));

//NEW ROUTE
router.get("/new", isLoggedIn,listingController.renderNewForm);

//create route
router.post("/", isLoggedIn, upload.single("listing[image]"),  validateListing, wrapAsync(listingController.createListing));

//SHOW ROUTE
router.get("/:id", wrapAsync(listingController.showListing));

//EDIT ROUTE
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

//UPDATE ROUTE
router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing));

//DELETE ROUTE
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)); 



module.exports = router; 