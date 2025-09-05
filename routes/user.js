const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controller/users.js");
const user = require("../models/user.js");

//sign up route
router.get("/signup", userController.renderSignupForm);

router.post("/signup", wrapAsync(userController.signup));


//login Route
router.get("/login", userController.renderLoginForm);

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), 
    userController.login);

//logout route
router.get("/logout", userController.logout);

module.exports = router;
