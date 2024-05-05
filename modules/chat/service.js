const chatDetailsModel = require("./model");
const { userDetailsModel } = require("../../models");
const { isUndefinedOrNull } = require("../../utils/validators");
const _ = require('lodash');

require("dotenv").config();

const chatService = {
  addMessage: async (req) => {
    let chat = new chatDetailsModel();
    chat.expertId = req.body.expertId.trim();
    chat.userId = req.body.expertId.trim();
    chat.message = req.body.expertId.trim();
    chat.senderId = req.body.expertId.trim();

    if (senderId != req.user.user_id && senderId != req.user.user_id) {
      throw new Error("Not Authourized to communicate");
    }
    const e = userDetailsModel.find({ type: 'expert', _id: userId });
    if (isUndefinedOrNull(e)) {
      throw new Error("Invalid expert ID.");
    }

    const u = userDetailsModel.find({ type: 'user', _id: expertId });
    if (isUndefinedOrNull(u)) {
      throw new Error("Invalid user ID.");
    }

    if (senderId != expertId && senderId != userId) {
      throw new Error("Invalid Sender Id (Sender Id must be either userId or expertId)");
    }

    try {
      savedChat = await chat.save();
    } catch (e) {
      throw new Error("Error  " + e.message);
    }
    return savedChat;
  },

  getChat: async (req) => {
    const userId = req.params.id;
    const { personId, page = 1, limit = 20 } = req.query;
  
    if (req.user.user_id !== userId) {
      throw new Error("Not Authorized to communicate");
    }
  
    const currentPage = parseInt(page, 10);
    const itemsPerPage = parseInt(limit, 10);
  
    if (isNaN(currentPage) || currentPage < 1 || isNaN(itemsPerPage) || itemsPerPage < 1) {
      throw new Error("Invalid pagination parameters");
    }
  
    const skip = (currentPage - 1) * itemsPerPage;
  
    const query = {};
  
    if (req.user.type === 'expert') {
      query.expertId = userId;
      query.userId = personId;
    } else {
      query.userId = userId;
      query.expertId = personId;
    }
  
    const chats = await chatDetailsModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(itemsPerPage);
  
    const totalChats = await chatDetailsModel.countDocuments(query);
  
    const result = {
      chats,
      currentPage,
      itemsPerPage,
      totalChats,
      totalPages: Math.ceil(totalChats / itemsPerPage),
    };
  
    return result;
  }

};

module.exports = chatService;
