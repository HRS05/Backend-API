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

const updateProfile = Joi.object().keys({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
    body: Joi.object().keys({
        name: Joi.string().optional(),
        age: Joi.number().optional(),
        gender: Joi.string().allow("M", "F").optional(),
        gst: Joi.string().optional(),
        bankName: Joi.string().optional(),
        ifscCode: Joi.string().optional(),
        bankAccountNumber: Joi.string().optional(),
        location: Joi.string().optional(),
        password: Joi.string().optional(),
        linkedinUrl: Joi.string().optional(),
        twitterUrl: Joi.string().optional(),
        profileUrl: Joi.string().optional(),
        category: Joi.alternatives().try(
            Joi.array().items(Joi.string()),
            Joi.string()
        ).optional().custom((value, helpers) => {
            if (!isUndefinedOrNull(value) && typeof value === 'string') {
                return [value];
            }
            return value;
        }, 'Convert string to array'),
        language: Joi.alternatives().try(
            Joi.array().items(Joi.string()),
            Joi.string()
        ).optional().custom((value, helpers) => {
            if (!isUndefinedOrNull(value) && typeof value === 'string') {
                return [value];
            }
            return value;
        }, 'Convert string to array'),
        about: Joi.string().optional(),
        experience: Joi.string().optional(),
    }),
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
    get,
    updateProfile
};
