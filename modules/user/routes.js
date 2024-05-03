const express = require('express');
const userController = require("./controller");
const router = express.Router();
const execute = require('../../middleware/executor')


router.post("/register", execute(userController.registerUser));
router.post("/login", execute(userController.loginUser));

module.exports = router;
