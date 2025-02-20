const { createBlog, readBlog, updateBlog, deleteBlog } = require("../controllers/user.controller")

const router = require("express").Router()
router
    .post("/create", createBlog)
    .get("/", readBlog)
    .patch("/update/:bid", updateBlog)
    .delete("/delete/:bid", deleteBlog)
module.exports = router