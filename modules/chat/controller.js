const chatService = require("./service");
const validation = require("./validation");

const chatController = {
  sendMessage: async (req, res) => {
    const x = validation.sendMessage(req);
    r = await chatService.sendMessage.validate(req);
    return r;
  },

  getChat: async (req, res) => {
    const x = validation.getChat.validate(req);
    r = await chatService.getChat(req);
    return r;
  },

};
module.exports = chatController;
