const { userDetailsModel } = require("../../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isUndefinedOrNull } = require("../../../utils/validators");
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
      throw new Error("Not admin" + email);
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
};

module.exports = adminService;
