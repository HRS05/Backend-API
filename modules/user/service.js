const userDetailsModel = require("./model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userService = {
  registerUserUtil: async (req) => {
    let user = new userDetailsModel();
    user.name = req?.body?.name?.trim();
    user.age = req?.body?.age;
    user.gender = req?.body?.gender?.trim();
    user.contactNumber = req?.body?.contactNumber?.trim();
    user.emailId = req?.body?.emailId?.trim();
    user.password = req?.body?.password?.trim();
    user.type = req?.body?.type?.trim();

    let email = user.emailId;
    user.password = await bcrypt.hash(user.password, 10);
    try {
      savedUser = await user.save();
    } catch (e) {
      throw new Error("adding user error -->  " + e);
    }

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
    return { result: "User created ", data: response };
  },

  loginUserUtil: async (req) => {
    let emailId = req?.body?.emailId?.trim();
    let password = req?.body?.password?.trim();
    const user = await userDetailsModel.findOne({ emailId });

    if (!(user && (await bcrypt.compare(password, user.password)))) {
      throw new Error("Invalid User " + emailId + "  " + password);
    }
    const token = jwt.sign(
      { user_id: user._id, email: emailId, type: user.type },
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

module.exports = userService;
