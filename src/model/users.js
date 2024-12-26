const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

userSchema.methods.generateAuthToken = async function() {
    try {
        const token = jwt.sign({_id: this._id.toString()}, "thisis32lettersserectkeyfortoken");
        this.tokens = this.tokens.concat({token: token});
        await this.save();
        return token;
    } catch(err) {
        console.log(err);
    }
}

userSchema.pre("save", async function(next) {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;