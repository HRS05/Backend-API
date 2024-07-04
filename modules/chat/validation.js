const Joi = require('joi');
const { TYPE } = require('./constant');

const sendMessage = {
    body: Joi.object().keys({
        reciverId: Joi.string().required(),
        senderId: Joi.string().required(),
        message: Joi.string().optional(),
        type: Joi.string().allow(TYPE.FILE, TYPE.TEXT).required(),
        url: Joi.string().optional(),
        sentTime: Joi.date().required(),
    }),
};

const getChat = {
    params: Joi.object().keys({
        id: Joi.string().required(),
    }),
    query: Joi.object().keys({
        limit: Joi.number().integer().min(1).max(20).optional(), 
        page: Joi.number().integer().min(0).optional(),
    }),
};


module.exports = {
    sendMessage,
    getChat
};
