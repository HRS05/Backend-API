const _ = require("lodash");
const { Logger } = require('../logger');


const execute = (func) => {
  return async (req, res, next) => {
    try {
      const result = await func(req, res);
      Logger.info("got called");
      return res.status(200).send({status: 200, data: result});
    } catch (e) {
        Logger.error(e.message);
      return res.status(400).send({status: 400, error: e.message});
    }
  };
};

module.exports = execute;
