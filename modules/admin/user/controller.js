const userService = require("./service");
const validate = require("./validation");
const { validateInfo } = require("../../../middleware/index")
const adminController = {

  registerUser: async (req, res) => {
    const data = validateInfo(validate.register, req.body);
    r = await userService.registerUserUtil(data);
    return r;
  },

  loginUser: async (req, res) => {
    const data = validateInfo(validate.login, req.body);
    r = await userService.loginUserUtil(data);
    return r;
  },

  get: async (req, res) => {
    const data = validateInfo(validate.get, req.query);
    r = await userService.get({ data, reqBy: req.user });
    return r;
  },

  updateProfile: async (req, res) => {
    const data = validateInfo(validate.updateProfile, { body: req.body, params: req.params });
    r = await userService.updateProfile({
      data,
      files: req.files,
    });
    return r;
  },

};
module.exports = adminController;
