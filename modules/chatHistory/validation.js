const Joi = require("joi");
const { UNREAD_TASK } = require('./constant');
const updateUnreadCount = Joi.object().keys({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
    body: Joi.object().keys({
        task: Joi.string().allow(UNREAD_TASK.DECREMENT, UNREAD_TASK.INCREMENT, UNREAD_TASK.MARK_ZERO).required(),
    }),
  });

module.exports = {
    updateUnreadCount
};
