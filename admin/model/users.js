const mongoose = require("mongoose");

//Schema
const userSchema = new mongoose.Schema({
    name: String,
    profileName: String,
    password: String,
    createdAt: { type: Date, default: Date.now },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

const User = mongoose.model("User", userSchema);

module.exports = User;