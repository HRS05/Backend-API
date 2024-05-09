const userDetailsModel = require("./model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userService = {
  registerUserUtil: async (data) => {
    const { name, gender, contactNumber, email, password, type} = data;
    let user = new userDetailsModel();
    user.name = name;
    user.gender = gender;
    user.contactNumber = contactNumber;
    user.email = email;
    user.password = password;
    user.type = type;

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
};

module.exports = userService;
