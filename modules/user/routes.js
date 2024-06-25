const express = require('express');
const userController = require("./controller");
const router = express.Router();
const execute = require('../../middleware/executor')
const { auth, executor, accessAllowed, imageUpload} = require('../../middleware/index')

router.get("/verify-token", auth, execute(() => "Valid token"));
router.post("/register", execute(userController.registerUser));
router.post("/login", execute(userController.loginUser));
router.post("/update-profile", auth, accessAllowed(['user', 'expert']), imageUpload(['image', 'image1']), executor(userController.updateProfile));
router.post("/send-otp-email", execute(userController.sendOTPEmail));
router.post("/verify-otp-email", execute(userController.verifyOTPEmail));
router.post("/get-experts", auth, accessAllowed(['user']), executor(userController.getExperts));
router.get("/get-expert/:id", auth, accessAllowed(['user']), executor(userController.getExpert));
router.get("/get-user/:id", auth, accessAllowed(['user', 'expert']), executor(userController.getUser));

module.exports = router;
