const Joi = require('joi');

const sendMessage = {
    body: Joi.object().keys({
        userId: Joi.string().required(),
        expertId: Joi.string().required(),
        senderId: Joi.string().required(),
        message: Joi.string().required(),
    }),
};

const getChat = {
    params: Joi.object().keys({
        id: Joi.string().required(),
    }),
    query: Joi.object().keys({
        personId: Joi.string().required(),
        limit: Joi.number().integer().min(1).max(20).optional(), 
        page: Joi.number().integer().min(0).optional(),
    }),
};


module.exports = {
    sendMessage,
    getChat
};
