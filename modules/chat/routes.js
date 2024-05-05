const express = require('express');
const chatController = require("./controller");
const router = express.Router();
const { auth, executor, accessAllowed} = require('../../middleware/index')


router.post("/send", auth, accessAllowed(['user', 'expert']), executor(chatController.sendMessage));
router.get("/get-chat/:id", auth, accessAllowed(['user', 'expert']), executor(chatController.getChat));

module.exports = router;
