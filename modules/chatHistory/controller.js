const chatHistoryService = require("./service");
const validate = require("./validation");
const { validateInfo } = require("../../middleware/index");

const chatController = {

  getHistory: async (req, res) => {
    r = await chatHistoryService.getHistory({reqBy: req.user});
    return r;
  },

  updateUnreadCount: async (req, res) => {
    const data = validateInfo(validate.updateUnreadCount, { params: req.params, body: req.body });
    r = await chatHistoryService.updateUnreadCount({data, reqBy: req.user});
    return r;
  },

};
module.exports = chatController;
