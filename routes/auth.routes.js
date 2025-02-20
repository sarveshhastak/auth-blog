const { registerUser, loginUser, logoutUser, registerAdmin, sendOTP, loginAdmin, logoutAdmin } = require("../controllers/auth.controller")

const router = require("express").Router()
router
    .post("/register-user", registerUser)
    .post("/login-user", loginUser)
    .post("/logout-user", logoutUser)



    .post("/register-admin", registerAdmin)
    .post("/sendotp", sendOTP)
    .post("/login-admin", loginAdmin)
    .post("/logout-admin", logoutAdmin)




module.exports = router