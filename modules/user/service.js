const userDetailsModel = require("./model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isUndefinedOrNull } = require("../../utils/validators");
const { TYPE } = require('./constant');
const { generateOTP } = require("../../utils/common");
const sendMail = require('../../utils/notification/email/send');
const { RedisCacheKey } = require("../../connection/redis");
const { putObjectToBucket } = require("../../utils/s3/s3");
const { s3ObjectDetails } = require("../../utils/s3/index");

require("dotenv").config();

const userService = {
  registerUser: async (data) => {
    const {
      name,
      gender,
      contactNumber,
      email,
      password,
      type,
      age,
      gst,
      bankName,
      ifscCode,
      bankAccountNumber,
      location,
      linkedinUrl,
      twitterUrl,
    } = data;
    // if (type == TYPE.EXPERT && isUndefinedOrNull(gst) && isUndefinedOrNull(bankName) && isUndefinedOrNull(ifscCode) && isUndefinedOrNull(bankAccountNumber)) {
    //     throw new Error('details missing from [ gst, bank name, ifsc code, account number ]');
    // }
    let user = await userDetailsModel.findOne({ email });

    if (!isUndefinedOrNull(user)) {
      throw new Error("Email Id already registred " + email);
    }

    user = await userDetailsModel.findOne({ contactNumber });

    if (!isUndefinedOrNull(user)) {
      throw new Error("Contact number already registred " + contactNumber);
    }

    user = new userDetailsModel();
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
    return { message: `${type} registred successfully.`, data: response };
  },

  loginUser: async (data) => {
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
      token,
    };
    return response;
  },

  sendOTPOnMail: async (data) => {
    const { email } = data;
    const user = await userDetailsModel.findOne({ email });

    if (!isUndefinedOrNull(user)) {
      throw new Error("Email Id already registred " + email);
    }

    let otp = '999999';

    if (process.env.ENABLE_MAILER_SERVICE == true) {
        otp = generateOTP();

        sendMail({
            otp,
            email,
          });
    }
    
    await RedisCacheKey.setValueForTime(`email:verify:${email}`, otp);

    let response = {
      message: "OTP sent successfully",
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
      message: "OTP verified successfully",
    };
    return response;
  },

  updateProfile: async ({ data, files, reqBy }) => {
    const {
      name,
      gender,
      password,
      age,
      gst,
      bankName,
      ifscCode,
      bankAccountNumber,
      location,
      linkedinUrl,
      twitterUrl,
      category,
      language,
      about,
      experience
    } = data;

    let user = {};
    user.name = name;
    if (!isUndefinedOrNull(gender)) user.gender = gender;
    if (!isUndefinedOrNull(experience)) user.experience = experience;
    if (!isUndefinedOrNull(category)) user.category = JSON.parse(category);
    if (!isUndefinedOrNull(language)) user.language = JSON.parse(language);
    if (!isUndefinedOrNull(about)) user.about = about;
    if (!isUndefinedOrNull(age)) user.age = age;
    if (!isUndefinedOrNull(linkedinUrl)) user.linkedinUrl = linkedinUrl;
    if (!isUndefinedOrNull(twitterUrl)) user.twitterUrl = twitterUrl;
    if (!isUndefinedOrNull(files?.image) && !isUndefinedOrNull(files && files?.image[0])) {
      user.profileUrl = await putObjectToBucket({
        data: files.image[0],
        user: reqBy,
        type: s3ObjectDetails.TYPES.PROFILE,
      });
    }
    user.password = password;
    user.location = location;

    if (reqBy.type == TYPE.EXPERT) {
      user.gst = gst;
      user.bankName = bankName;
      user.ifscCode = ifscCode;
      user.bankAccountNumber = bankAccountNumber;
    }

    if (user.password) user.password = await bcrypt.hash(user.password, 10);
    const x = await userDetailsModel.updateOne(
      { _id: reqBy.user_id },
      { ...user }
    );

    return { result: `${reqBy.type} updated successfully.` };
  },

  getExperts: async ({ data, reqBy }) => {
    const { category, page, limit } = data;

    const currentPage = page ? page : 1;
    const itemsPerPage = limit ? limit : 20

    if (
      isNaN(currentPage) ||
      currentPage < 1 ||
      isNaN(itemsPerPage) ||
      itemsPerPage < 1
    ) {
      throw new Error("Invalid pagination parameters");
    }

    const skip = (currentPage - 1) * itemsPerPage;

    const query = {
      type: TYPE.EXPERT,
    };

    if (category.length > 0) query.category = { $all: category };

    const experts = await userDetailsModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(itemsPerPage);

    const total = await userDetailsModel.countDocuments(query);

    const result = {
      experts,
      currentPage,
      itemsPerPage,
      total,
      totalPages: Math.ceil(total / itemsPerPage),
    };

    return result;
  },

  getExpert: async ({ data, reqBy }) => {
    const { id } = data;

    const query = {
      _id: id,
      type: TYPE.EXPERT,
    };


    const expert = await userDetailsModel
      .findOne(query);

    if (isUndefinedOrNull(expert)) {
        throw new Error(`No expert exists with given id: ${id}`);
    }  

    const result = {
      expert,
    };

    return result;
  },

  getUser: async ({ data, reqBy }) => {
    const { id } = data;

    const query = {
      _id: id,
      type: TYPE.USER,
    };


    const expert = await userDetailsModel
      .findOne(query);

    if (isUndefinedOrNull(expert)) {
        throw new Error(`No user exists with given id: ${id}`);
    }  

    const result = {
      expert,
    };

    return result;
  },
};

module.exports = userService;
