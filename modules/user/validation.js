const Joi = require('joi');

const register = Joi.object({
	name: Joi.string().required(),
	type: Joi.string().allow("user", "expert").required(),
    contactNumber: Joi.string().required(),
    email: Joi.string().required(),
    age: Joi.number().optional(),
	gender: Joi.string().allow("M", "F").optional(),
    gst: Joi.string().optional(),
    bankName: Joi.string().optional(),
    ifscCode: Joi.string().optional(),
    bankAccountNumber: Joi.string().optional(),
    location: Joi.string().required(),
    password: Joi.string().required(),
    linkedinUrl: Joi.string().optional(),
    twitterUrl: Joi.string().optional(),
});

const login = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});

const sendOTPEmail = Joi.object({
    email: Joi.string().required(),
});

const sendOTPPhone = Joi.object({
    phone: Joi.string().required(),
});

const verifyOTPEmail = Joi.object({
    email: Joi.string().required(),
    otp: Joi.string().required(),
});

const verifyOTPPhone = Joi.object({
    phone: Joi.string().required(),
    otp: Joi.string().required(),
});


module.exports = {
    register,
    login,
    sendOTPEmail,
    sendOTPPhone,
    verifyOTPEmail,
    verifyOTPPhone
};
