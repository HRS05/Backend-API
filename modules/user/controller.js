const userService = require("./service");

const userController = {
  registerUser: async (req, res) => {
    let user = {};
    user.name = req?.body?.name?.trim();
    user.age = req?.body?.age;
    user.gender = req?.body?.gender?.trim();
    user.contactNumber = req?.body?.contactNumber?.trim();
    user.emailId = req?.body?.emailId?.trim();
    user.password = req?.body?.password;
    user.companyId = req?.body?.companyId;
    user.companyName = req?.body?.companyName;
    user.type = req?.body?.type;

    if (!user?.name || user?.name?.length == 0)
      throw new Error("Name required");
    if (!user?.age || user?.age < 18 || user.age > 65)
      throw new Error("age of user must be in between 18 to 85");
    if (!user?.gender || user?.gender?.length == 0)
      throw new Error("gender required");
    if (!user?.contactNumber || user?.contactNumber?.length != 10)
      throw new Error("size of mobile number should be 10");
    if (!user?.emailId || user?.emailId?.length < 11)
      throw new Error("correct email required");
    if (!user?.type) throw new Error("type required");
    if (!user?.password || user?.password?.length == 0)
      throw new Error("Password required");

    r = await userService.registerUserUtil(req);
    return r;
  },

  loginUser: async (req, res) => {
    let emailId = req?.body?.emailId?.trim();
    let password = req?.body?.password?.trim();
    if (!emailId || emailId?.length < 11)
      throw new Error("correct email required");
    if (!password || password?.length == 0)
      throw new Error("Password required");
    r = await userService.loginUserUtil(req);
    return r;
  },
};
module.exports = userController;
