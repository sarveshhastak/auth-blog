const asyncHandler = require("express-async-handler")
const User = require("../models/User")
const blog = require("../models/blog")



exports.getAllUsers = asyncHandler(async (req, res) => {
    // const result = await User.find().select("name email")
    const result = await User.find().select("-password -__v")
    res.json({ message: "getAllUsers Success", result })
})
exports.blockUnclockUserAccount = asyncHandler(async (req, res) => {
    const { uid } = req.params
    await User.findByIdAndUpdate(uid, { isActive: req.body.isActive })
    res.json({ message: "blockUnclockUserAccount Success" })
})


exports.getAllBlogs = asyncHandler(async (req, res) => {
    const result = await blog.find().select("-__v")
    res.json({ message: "getAllBlogs Success", result })
})
exports.publishUnpublishBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params
    await blog.findByIdAndUpdate(bid, { isPublish: req.body.isPublish })
    res.json({ message: "publishUnpublishBlog Success" })
})