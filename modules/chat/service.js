const chatDetailsModel = require("./model");
const { userDetailsModel } = require("../../models");
const { isUndefinedOrNull } = require("../../utils/validators");
const _ = require('lodash');

require("dotenv").config();

const chatService = {
  sendMessage: async (data) => {
    let chat = new chatDetailsModel();
    const { reciverId, senderId, message, type, url, sentTime } = data
    
    chat.reciverId = reciverId;
    chat.senderId = senderId;
    chat.message = message;
    chat.type = type;
    chat.sentTime = sentTime;
    if (!isUndefinedOrNull(url)) chat.url = url;

    try {
      savedChat = await chat.save();
    } catch (e) {
      throw new Error("Error  " + e.message);
    }
    return savedChat;
  },

  getChat: async (d) => {
    const { data  , reqBy } = d;
    const { query, params } = data;
    const id1 = params.id;
    const id2 = reqBy.user_id;
    const { page = 1, limit = 20 } = data.query;
  
    const currentPage = parseInt(page, 10);
    const itemsPerPage = parseInt(limit, 10);
  
    if (isNaN(currentPage) || currentPage < 1 || isNaN(itemsPerPage) || itemsPerPage < 1) {
      throw new Error("Invalid pagination parameters");
    }
  
    const skip = (currentPage - 1) * itemsPerPage;
  
    const q = {
      reciverId: { $in: [id1, id2] },
      senderId: { $in: [id1, id2] }
    };
  
    const chats = await chatDetailsModel.find(q)
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
