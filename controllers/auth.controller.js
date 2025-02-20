const asyncHandler = require("express-async-handler")
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const admin = require("../models/admin")
const { differenceInSeconds } = require("date-fns")
const { genrateOTP } = require("../utils/genrateOTP")
const { sendEmail } = require("../utils/email")



exports.registerUser = asyncHandler(async (req, res) => {
    const { email, mobile, password } = req.body
    const result = await User.findOne({ $or: [{ email }, { mobile }] })
    if (result) {
        return res.status(401).json({ message: "Email or Mobile already exist" })
    }
    const hash = await bcrypt.hash(password, 10)
    await User.create({ ...req.body, password: hash })
    res.json({ message: "Register Success" })
})



exports.loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    const result = await User.findOne({ $or: [{ email: username }, { mobile: username }] })
    if (!result) {
        res.status(401).json({ message: "Email or Mobile does not exist" })
    }
    const verify = await bcrypt.compare(password, result.password)
    if (!verify) {
        res.status(401).json({ message: "Invalid Password" })
    }
    if (!result.isActive) {
        return res.status(401).json({ message: "Account Blocked By Admin" })
    }
    const token = jwt.sign({ _id: result._id, name: result.name }, process.env.JWT_KEY)
    res.cookie("USER", token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true, secure: false })
    res.json({ message: "Login Success", result: { _id: result._id, name: result.name, email: result.email } })
})



exports.logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("USER")
    res.json({ message: "Logout Success" })
})




exports.registerAdmin = asyncHandler(async (req, res) => {
    await admin.create(req.body)
    res.json({ message: "Admin Register Success" })
})


exports.sendOTP = asyncHandler(async (req, res) => {
    const { username } = req.body
    const result = await admin.findOne({ $or: [{ email: username }, { mobile: username }] })
    if (!result) {
        return res.status(401).json({ message: "Invalid Email or Mobile" })
    }

    const otp = genrateOTP()
    // console.log(otp);

    await admin.findByIdAndUpdate(result._id, { otp, otpSendOn: new Date() })
    sendEmail({ to: result.email, subject: "Verify your login OTP", message: `Your OTP is ${otp}` })
    res.json({ message: "Admin otp send Success" })
})


exports.loginAdmin = asyncHandler(async (req, res) => {
    const { username, otp } = req.body
    const result = await admin.findOne({ $or: [{ email: username }, { mobile: username }] })
    if (!result) {
        return res.status(401).json({ message: "Invalid Email or Mobile" })
    }

    if (result.otp != otp) {
        return res.status(401).json({ message: "Invalid OTP" })
    }

    if (differenceInSeconds(new Date(), result.otpSendOn) > 60) {
        return res.status(401).json({ message: "OTP expire" })
    }

    await admin.findByIdAndUpdate(result._id, { otp: null })   //👈to use 1 otp only once
    const token = jwt.sign({ _id: result._id, name: result.name }, process.env.JWT_KEY)
    res.cookie("ADMIN", token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true, secure: false })
    res.json({
        message: "Admin Login Success", result: {
            _id: result._id,
            name: result.name,
            email: result.email,
            mobile: result.mobile,
        }
    })
})


exports.logoutAdmin = asyncHandler(async (req, res) => {
    res.clearCookie("ADMIN")
    res.json({ message: "Admin Logout Success" })
})