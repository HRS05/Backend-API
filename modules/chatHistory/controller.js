const chatService = require("./service");
const validate = require("./validation");
const { validateInfo } = require("../../middleware/index");

const chatController = {

  getHistory: async (req, res) => {
    r = await chatService.getHistory({reqBy: req.user});
    return r;
  },

};
module.exports = chatController;
