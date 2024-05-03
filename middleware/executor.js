const _ = require("lodash");

const execute = (func) => {
  return async (req, res, next) => {
    try {
      const result = await func(req, res);
      return res.status(200).send(result);
    } catch (e) {
      return res.status(400).send(e.message);
    }
  };
};

module.exports = execute;
