const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
exports.userProtected = asyncHandler(async (req, res, next) => {
    //step 1 : check for cookie

    const token = req.cookies.USER
    if (!token) {
        return res.status(401).json({ message: "No Cookie Found" })
    }
    //step 2 : get _id from token

    jwt.verify(token, process.env.JWT_KEY, async (err, data) => {
        if (err) {
            return res.status(401).json({ message: "Invalid Token", error: err.message })
        }
        req.loggInUser = data._id
        const result = await User.findById(data._id)
        if (!result.isActive) {
            return res.status(401).json({ message: "Account Blocked" })
        }
        next()
    })

})



exports.adminProtected = asyncHandler(async (req, res, next) => {
    //step 1 : check for cookie

    const token = req.cookies.ADMIN
    if (!token) {
        return res.status(401).json({ message: "No Cookie Found" })
    }
    //step 2 : get _id from token

    jwt.verify(token, process.env.JWT_KEY, (err, data) => {
        if (err) {
            return res.status(401).json({ message: "Invalid Token", error: err.message })
        }
        req.loggInUser = data._id
        next()
    })

})