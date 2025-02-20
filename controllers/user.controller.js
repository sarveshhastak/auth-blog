const asyncHandler = require("express-async-handler")
const cloudinary = require("cloudinary").v2
const upload = require("../utils/upload")
const blog = require("../models/blog")
const path = require("path")

cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME
})
exports.createBlog = asyncHandler(async (req, res) => {
    upload(req, res, async (err) => {
        // console.log(req.file);
        // console.log(req.body);
        if (req.file) {
            const { secure_url } = await cloudinary.uploader.upload(req.file.path)
            await blog.create({ ...req.body, user: req.loggInUser, hero: secure_url })
        }
        res.json({ message: "Blog Create Success" })
    })
})


exports.readBlog = asyncHandler(async (req, res) => {
    const result = await blog.find({ user: req.loggInUser })
    res.json({ message: "Blog Read Success", result })
})


exports.updateBlog = asyncHandler(async (req, res) => {
    upload(req, res, async (err) => {
        if (req.file) {
            //new file recieved
            const { bid } = req.params
            const result = await blog.findById(bid)
            await cloudinary.uploader.destroy(path.basename(result.hero).split(".")[0])
            const { secure_url } = await cloudinary.uploader.upload(req.file.path)
            await blog.findByIdAndUpdate(req.params.bid, { ...req.body, hero: secure_url })
            res.json({ message: "Blog Update Success" })
        } else {
            await blog.findByIdAndUpdate(req.params.bid, req.body)
            res.json({ message: "Blog Update Success" })
        }
    })
})


exports.deleteBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params
    const result = await blog.findById(bid)
    await cloudinary.uploader.destroy(path.basename(result.hero).split(".")[0])
    await blog.findByIdAndDelete(bid)
    res.json({ message: "Blog Delete Success" })
})