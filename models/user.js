const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocaLMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
})

userSchema.plugin(passportLocaLMongoose);         // add passport-local-mongoose plugin to userSchema, adds username, hash password , and auth methods

module.exports = mongoose.model("User", userSchema);