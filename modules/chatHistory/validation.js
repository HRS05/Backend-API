const Joi = require("joi");

const updateUnreadCount = Joi.object().keys({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
    body: Joi.object().keys({
        task: Joi.string().allow("INCR", "MARK_ZERO", "DECR").required(),
    }),
  });

module.exports = {
};
