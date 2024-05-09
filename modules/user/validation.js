const Joi = require('joi');

const register = Joi.object({
	name: Joi.string().required(),
	type: Joi.string().allow("user", "expert").required(),
    contactNumber: Joi.string().required(),
    email: Joi.string().required(),
    age: Joi.number().optional(),
	gender: Joi.string().allow("M", "F").required(),
    gst: Joi.string().optional(),
    bankName: Joi.string().optional(),
    ifscCode: Joi.string().optional(),
    bankAccountNumber: Joi.string().optional(),
    location: Joi.string().required(),
    password: Joi.string().required(),
});

const login = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});




module.exports = {
    register,
    login
};
