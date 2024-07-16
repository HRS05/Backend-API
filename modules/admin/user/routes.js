const express = require('express');
const adminController = require("./controller");
const router = express.Router();
const { auth, executor, accessAllowed } = require('../../../middleware/index')


router.post("/register", executor(adminController.registerUser));
router.post("/login", executor(adminController.loginUser));
router.get("/get", auth, accessAllowed(['admin']), executor(adminController.get));


module.exports = router;
