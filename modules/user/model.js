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
    contactNumber: { type: String, unique: true },
    isContactVerified: { type: Boolean, default: 'false' },
    email: { type: String, unique: true },
    isMailVerified: { type: Boolean, default: 'false' },
    gender: String,
    age: Number,
    type: String,
    isVerified: { type: Boolean, default: 'false' },
    profileUrl: String,
    info: String,
    gst: String,
    linkedinUrl: String,
    twitterUrl: String,
    bankName: String,
    ifscCode: String,
    bankAccountNumber: String,
    location: String,
    checkUrl: String,
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
