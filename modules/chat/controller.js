const chatService = require("./service");
const validate = require("./validation");
const { validateInfo } = require("../../middleware/index");

const chatController = {
  sendMessage: async (req, res) => {
    const data = validateInfo(validate.sendMessage, req.body);
    r = await chatService.sendMessage(data);
    return r;
  },

  getChat: async (req, res) => {
    const data = validateInfo(validate.getChat, { params: req.params, query: req.query });
    r = await chatService.getChat({data, reqBy: req.user});
    return r;
  },

};
module.exports = chatController;
