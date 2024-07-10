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

const updateProfile = Joi.object({
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
    category: Joi.string().optional(), //array
    language: Joi.string().optional(), //array
    about: Joi.string().optional(),
    experience: Joi.string().optional(),
});

const getExperts = Joi.object({
	category: Joi.array().items(Joi.string()).required(),
    limit: Joi.number().integer().min(1).max(20).optional(), 
    page: Joi.number().integer().min(0).optional(),
});

const getExpert = Joi.object({
	id: Joi.string().required(),
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
    verifyOTPPhone,
    updateProfile,
    getExperts,
    getExpert
};
