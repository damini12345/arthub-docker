const jwt = require("jsonwebtoken");
const User = require("../model/users");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, "thisis32lettersserectkeyfortoken");
        const user = await User.findOne({_id: verifyUser._id});
        req.token = token;
        req.user = user;
        next();
    } catch(err) {
        res.send(err);
    }
}

module.exports = auth;