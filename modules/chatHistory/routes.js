const express = require('express');
const chatController = require("./controller");
const router = express.Router();
const { auth, executor, accessAllowed} = require('../../middleware/index')

router.get("/get", auth, accessAllowed(['user', 'expert']), executor(chatController.getHistory));

module.exports = router;
