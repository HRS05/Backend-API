const Joi = require('joi');
const { isUndefinedOrNull } = require('../../../utils/validators');

const register = Joi.object({
	name: Joi.string().required(),
    contactNumber: Joi.string().required(),
    email: Joi.string().required(),
    age: Joi.number().optional(),
	gender: Joi.string().allow("M", "F").optional(),
    password: Joi.string().required(),
});

const login = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});

const get = Joi.object({
	category: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
    ).optional().custom((value, helpers) => {
        if (!isUndefinedOrNull(value) && typeof value === 'string') {
            return [value]; // Convert string to array of one string
        }
        return value; // Return the array as is
    }, 'Convert string to array'),
    limit: Joi.number().integer().min(1).max(20).optional(), 
    page: Joi.number().integer().min(0).optional(),
    type: Joi.string().allow("user", "expert").required(),
});

module.exports = {
    register,
    login,
    get
};
