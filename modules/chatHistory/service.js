const chatHistoryModel = require("./model");
const { isUndefinedOrNull } = require("../../utils/validators");
const _ = require('lodash');
const { userCache } = require('../user/index')
require("dotenv").config();

const chatService = {
  addHistory: async (data) => {
    const { reciverId, senderId, message, type, url, sentTime } = data
    const check = await chatHistoryModel.findOne({
      reciverId: reciverId,
      senderId: senderId
    });

    if (!isUndefinedOrNull(check)) {
      await chatHistoryModel.updateOne({_id: check._id},{
        lastMessage: message,
        sentTime: sentTime,
        type: type
      })
    }
    else {
      let chatHistory = new chatHistoryModel();
    
      chatHistory.reciverId = reciverId;
      chatHistory.senderId = senderId;
      chatHistory.lastMessage = message;
      chatHistory.type = type;
      chatHistory.sentTime = sentTime;
      if (!isUndefinedOrNull(url)) chatHistory.url = url;

      try {
        savedChat = await chatHistory.save();
      } catch (e) {
        throw new Error("Error  " + e.message);
      }
    }
  },

  getHistory: async (d) => {
    const { reqBy } = d;
    const userId = reqBy.user_id;

    const q = {
      $or: [{ senderId: userId }, { reciverId: userId }],
    };

    const data = await chatHistoryModel.find(q).sort({ updatedAt: -1 });
  
    const chatHistory = [];
    const mp = {};

    for (const value of data) {
      let data = value._doc
      if (value.senderId == userId) {
        if (isUndefinedOrNull(mp[value.reciverId])) {
          data.personData = await userCache.getUserBasicDetails(value.reciverId);
          chatHistory.push(data);
          mp[value.reciverId] = true;
        }
      } else if (value.reciverId == userId) {
        if (isUndefinedOrNull(mp[value.senderId])) {
          data.personData = await userCache.getUserBasicDetails(value.senderId);
          chatHistory.push(data);
          mp[value.senderId] = true;
        }
      }
    };

    const result = {
      chatHistory,
    };
  
    return result;
  }

};

module.exports = chatService;
