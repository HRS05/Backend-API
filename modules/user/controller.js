const userService = require("./service");
const validate = require("./validation");
const { validateInfo } = require("../../middleware/index");
const userController = {
  registerUser: async (req, res) => {
    const data = validateInfo(validate.register, req.body);
    r = await userService.registerUser(data);
    return r;
  },

  loginUser: async (req, res) => {
    const data = validateInfo(validate.login, req.body);
    r = await userService.loginUser(data);
    return r;
  },

  sendOTPEmail: async (req, res) => {
    const data = validateInfo(validate.sendOTPEmail, req.body);
    r = await userService.sendOTPOnMail(data);
    return r;
  },

  verifyOTPEmail: async (req, res) => {
    const data = validateInfo(validate.verifyOTPEmail, req.body);
    r = await userService.verifyOTPforMail(data);
    return r;
  },

  updateProfile: async (req, res) => {
    const data = validateInfo(validate.updateProfile, req.body);
    r = await userService.updateProfile({
      data,
      files: req.files,
      reqBy: req.user,
    });
    return r;
  },

  getExperts: async (req, res) => {
    const data = validateInfo(validate.getExperts, req.body);
    r = await userService.getExperts({ data, reqBy: req.user });
    return r;
  },

  getExpert: async (req, res) => {
    const data = validateInfo(validate.getExpert, req.params);
    r = await userService.getExpert({ data, reqBy: req.user });
    return r;
  },

  getUser: async (req, res) => {
    const data = validateInfo(validate.getExpert, req.params);
    r = await userService.getUser({ data, reqBy: req.user });
    return r;
  },

  getInfo: async (req, res) => {
    r = await userService.getInfo({ reqBy: req.user });
    return r;
  },

};
module.exports = userController;
