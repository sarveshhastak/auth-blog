const mongoose = require("mongoose")


module.exports = mongoose.model("blog", new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    hero: { type: String, required: true },
    isPublish: { type: Boolean, default: true },
}))