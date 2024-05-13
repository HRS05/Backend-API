const express = require('express');
const userController = require("./controller");
const router = express.Router();
const execute = require('../../middleware/executor')


router.post("/register", execute(userController.registerUser));
router.post("/login", execute(userController.loginUser));
router.post("/send-otp-email", execute(userController.sendOTPEmail));
router.post("/verify-otp-email", execute(userController.verifyOTPEmail));



module.exports = router;
