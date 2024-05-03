const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const TYPE = {
  ADMIN: "admin",
  USER: "user",
  EXPERT: "expert",
};

var userSchema = new mongoose.Schema(
  {
    name: String,
    gender: String,
    age: Number,
    type: String,
    contactNumber: { type: String, unique: true },
    emailId: { type: String, unique: true },
    password: String,
  },
  { timestamps: true }
);
module.exports =
  mongoose.models.userDetailsModel ||
  mongoose.model("userDetailsModel", userSchema);

userSchema.statics.ADMIN = TYPE.ADMIN;
userSchema.statics.USER = TYPE.USER;
userSchema.statics.EXPERT = TYPE.EXPERT;
