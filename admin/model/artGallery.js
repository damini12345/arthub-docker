const mongoose = require("mongoose");
const User = require("./users");
//Schema
const artGallerySchema = new mongoose.Schema({
    images: String,
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    is_deleted: { type: Boolean, default: 0 },
});

const ArtGallery = mongoose.model("ArtGallery", artGallerySchema);

module.exports = ArtGallery;