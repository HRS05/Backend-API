const express = require('express');
const chatController = require("./controller");
const router = express.Router();
const { auth, executor, accessAllowed} = require('../../middleware/index')

router.get("/get", auth, accessAllowed(['user', 'expert']), executor(chatController.getHistory));
router.post("/unread-count/:id", auth, accessAllowed(['user', 'expert']), executor(chatController.updateUnreadCount));

module.exports = router;
