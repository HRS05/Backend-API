const _ = require("lodash");
const { Logger } = require("../logger");

const execute = (func) => {
  return async (req, res, next) => {
    const startTime = Date.now();
    const apiPath = req.path;
    try {
      const result = await func(req, res);
      const endTime = Date.now();
      const duration = endTime - startTime;
      Logger.info(`API ${apiPath} called and took ${duration}ms`);
      return res.status(200).send({ status: 200, data: result });
    } catch (e) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      Logger.error(
        `API ${apiPath} called and failed after ${duration}ms: ${e.message}`
      );
      return res.status(400).send({ status: 400, error: e.message });
    }
  };
};

module.exports = execute;
