const { getAllUsers, blockUnclockUserAccount, getAllBlogs, publishUnpublishBlog } = require("../controllers/admin.controller")

const router = require("express").Router()
router
    .get("/users", getAllUsers)
    .get("/blogs", getAllBlogs)
    .patch("/block-unclock-user/:uid", blockUnclockUserAccount)
    .patch("/publish-unpublish-blog/:bid", publishUnpublishBlog)
module.exports = router