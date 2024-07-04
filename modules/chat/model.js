const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
mongoose.Promise = global.Promise;


var chatSchema = new mongoose.Schema(
  {
    reciverId: String,
    senderId: String,
    message: String,
    url: String,
  },
  { timestamps: true }
);
module.exports =
  mongoose.models.chatDetailsModel ||
  mongoose.model("chatDetailsModel", chatSchema);