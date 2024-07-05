const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
mongoose.Promise = global.Promise;


var chatHistorySchema = new mongoose.Schema(
  {
    reciverId: String,
    senderId: String,
    lastMessage: String,
    url: String,
    sentTime: Date,
    type: String,
  },
  { timestamps: true }
);
module.exports =
  mongoose.models.chatHistoryModel ||
  mongoose.model("chatHistoryModel", chatHistorySchema);