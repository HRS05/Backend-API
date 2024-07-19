const express = require('express');
const adminController = require("./controller");
const router = express.Router();
const { auth, executor, accessAllowed, imageUpload } = require('../../../middleware/index')


router.post("/register", executor(adminController.registerUser));
router.post("/login", executor(adminController.loginUser));
router.get("/get", auth, accessAllowed(['admin']), executor(adminController.get));
router.post("/update-profile/:id", auth, accessAllowed(['admin']), imageUpload(['image', 'image1']), executor(adminController.updateProfile));


module.exports = router;
