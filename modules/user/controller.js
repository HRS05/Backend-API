const userService = require("./service");
const validate = require("./validation");
const { validateInfo } = require("../../middleware/index")
const userController = {

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
};
module.exports = userController;
