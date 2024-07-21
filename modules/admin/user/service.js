const { userDetailsModel } = require("../../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isUndefinedOrNull } = require("../../../utils/validators");
const { putObjectToBucket } = require("../../../utils/s3/s3");
const { s3ObjectDetails } = require("../../../utils/s3/index");
const { TYPE } = require('./constant');
require("dotenv").config();

const adminService = {
  registerUserUtil: async (data) => {
    const { name, gender, contactNumber, email, password} = data;
    let user = new userDetailsModel();
    user.name = name;
    if (!isUndefinedOrNull(gender)) user.gender = gender;
    if (!isUndefinedOrNull(age)) user.age = age;
    user.contactNumber = contactNumber;
    user.email = email;
    user.password = password;
    user.type = 'admin';
    
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

    if (user.type != 'admin') {
      throw new Error("Not admin " + email);
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

  get: async ({ data, reqBy }) => {
    const { category, page, limit, type } = data;

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
      type,
      $nin : ['deleted']
    };

    if (!isUndefinedOrNull(category) && category.length > 0) query.category = { $all: category };

    const res = await userDetailsModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(itemsPerPage);

    const total = await userDetailsModel.countDocuments(query);

    const result = {
      currentPage,
      itemsPerPage,
      total,
      totalPages: Math.ceil(total / itemsPerPage),
    };
    result[type] = res;

    return result;
  },

  updateProfile: async ({ data, files }) => {
    const { body, params } = data
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
    } = body;

    let person = await userDetailsModel.findById(params.id);

    if (isUndefinedOrNull(person)) {
      throw new Error(`Invalid person Id: ${params.id} for update`);
    }

    let user = {};
    if (!isUndefinedOrNull(name)) user.name = name;
    if (!isUndefinedOrNull(gender)) user.gender = gender;
    if (!isUndefinedOrNull(experience)) user.experience = experience;
    if (!isUndefinedOrNull(category)) user.category = category;
    if (!isUndefinedOrNull(language)) user.language = language;
    if (!isUndefinedOrNull(about)) user.about = about;
    if (!isUndefinedOrNull(age)) user.age = age;
    if (!isUndefinedOrNull(linkedinUrl)) user.linkedinUrl = linkedinUrl;
    if (!isUndefinedOrNull(twitterUrl)) user.twitterUrl = twitterUrl;
    if (!isUndefinedOrNull(files?.image) && !isUndefinedOrNull(files && files?.image[0])) {
      user.profileUrl = await putObjectToBucket({
        data: files.image[0],
        user: person._id,
        type: s3ObjectDetails.TYPES.PROFILE,
      });
    }
    if (!isUndefinedOrNull(password)) user.password = password;
    if (!isUndefinedOrNull(location)) user.location = location;

    if (person.type == TYPE.EXPERT) {
      user.gst = gst;
      user.bankName = bankName;
      user.ifscCode = ifscCode;
      user.bankAccountNumber = bankAccountNumber;
    }

    if (user.password) user.password = await bcrypt.hash(user.password, 10);
    const x = await userDetailsModel.updateOne(
      { _id: params.id },
      { ...user }
    );

    //clearing cache
    // await cache.deleteUserBasicDetails(params.id);

    return { result: `${person.type} updated successfully.` };
  },

  deleteProfile: async ({ data, reqBy}) => {
    const { id } = data;
    const user = await userDetailsModel.findById(id);

    if (isUndefinedOrNull(user)) {
      throw new Error("Invalid User " + id);
    }

    const x = await userDetailsModel.updateOne(
      { _id: id },
      { status: 'deleted' }
    );

    return { result: `${user.type} deleted successfully.` };
  },

};

module.exports = adminService;
