const userDetailsModel = require("./model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isUndefinedOrNull } = require("../../utils/validators");
const { TYPE } = require('./constant');
const { generateOTP } = require("../../utils/common");
const sendMail = require('../../utils/notification/email/send');
const { RedisCacheKey } = require("../../connection/redis");

require("dotenv").config();

const userService = {
  registerUserUtil: async (data) => {
    const { name, gender, contactNumber, email, password, type, age, gst, bankName, ifscCode, bankAccountNumber, location, linkedinUrl, twitterUrl } = data;
    if (type == TYPE.EXPERT && isUndefinedOrNull(gst) && isUndefinedOrNull(bankName) && isUndefinedOrNull(ifscCode) && isUndefinedOrNull(bankAccountNumber)) {
        throw new Error('details missing from [ gst, bank name, ifsc code, account number ]');
    } 
    let user = new userDetailsModel();
    user.name = name;
    if (!isUndefinedOrNull(gender)) user.gender = gender;
    if (!isUndefinedOrNull(age)) user.age = age;
    if (!isUndefinedOrNull(linkedinUrl)) user.linkedinUrl = linkedinUrl;
    if (!isUndefinedOrNull(twitterUrl)) user.twitterUrl = twitterUrl;
    user.contactNumber = contactNumber;
    user.email = email;
    user.password = password;
    user.type = type;
    user.location = location;

    if (type == TYPE.EXPERT) {
        user.gst = gst;
        user.bankName = bankName;
        user.ifscCode = ifscCode;
        user.bankAccountNumber = bankAccountNumber;
    }

    user.password = await bcrypt.hash(user.password, 10);
    savedUser = await user.save();
    
    const token = jwt.sign(
      { user_id: savedUser._id, email, type: user.type },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    let response = {};
    response.token = token;
    return { result: `${type} registred successfully.`, data: response };
  },

  loginUserUtil: async (data) => {
    const { email, password } = data;
    const user = await userDetailsModel.findOne({ email });

    if (!(user && (await bcrypt.compare(password, user.password)))) {
      throw new Error("Invalid User " + email);
    }
    const token = jwt.sign(
      { user_id: user._id, email, type: user.type },
      process.env.TOKEN_KEY,
      {
        expiresIn: "24h",
      }
    );
    // save user token
    let response = {
        user,
        token
    };
    return response;
  },

  sendOTPOnMail: async (data) => {
    const { email } = data;
    const user = await userDetailsModel.findOne({ email });

    if (!isUndefinedOrNull(user)) {
      throw new Error("Email Id already registred " + email);
    }
    
    const otp = generateOTP();

    sendMail({
        otp, email
    })

    await RedisCacheKey.setValueForTime(`email:verify:${email}`, otp);

    let response = {
        message: 'OTP sent successfully'
    };
    return response;
  },

  verifyOTPforMail: async (data) => {
    const { email, otp } = data;
    const user = await userDetailsModel.findOne({ email });

    if (!isUndefinedOrNull(user)) {
      throw new Error("Email Id already registred " + email);
    }

    const savedOTP = await RedisCacheKey.getValue(`email:verify:${email}`);

    if (otp != savedOTP) {
        throw new Error("Invalid OTP for mail id: " + email);
    }

    RedisCacheKey.deleteKey(`email:verify:${email}`);

    let response = {
        message: 'OTP verified successfully'
    };
    return response;
  },


};

module.exports = userService;
