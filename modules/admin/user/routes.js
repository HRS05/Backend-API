const express = require('express');
const adminController = require("./controller");
const router = express.Router();
const execute = require('../../../middleware/executor')


router.post("/register", execute(adminController.registerUser));
router.post("/login", execute(adminController.loginUser));

module.exports = router;
