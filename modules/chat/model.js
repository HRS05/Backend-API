const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
mongoose.Promise = global.Promise;


var chatSchema = new mongoose.Schema(
  {
    userId: String,
    expertId: String,
    sender: String, // ethier userId or expertId
    message: String,
    url: String,
    type: String,
  },
  { timestamps: true }
);
module.exports =
  mongoose.models.chatDetailsModel ||
  mongoose.model("chatDetailsModel", chatSchema);