const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    accessToken: { type: String },
    name: { type: String },
    email: { type: String },
    image: { type: String },
})

const user = mongoose.model("User", userSchema);
 
module.exports = user;