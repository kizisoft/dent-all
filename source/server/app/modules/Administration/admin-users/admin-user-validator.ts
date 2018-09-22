import * as Joi from 'joi';

export const createAdminUserModel = Joi.object().keys({
    firstName: Joi.string().trim().min(1).max(30).required(),
    lastName: Joi.string().trim().min(1).max(30).required(),
    email: Joi.string().email().trim().min(8).max(100).required(),
    password: Joi.string().trim().min(6).max(30).required(),
    scope: Joi.array().items(Joi.string()).min(1)
});

export const updateAdminUserModel = Joi.object().keys({
    firstName: Joi.string().trim().min(1).max(30),
    lastName: Joi.string().trim().min(1).max(30),
    password: Joi.string().trim().min(6).max(30),
    scope: Joi.array().items(Joi.string())
}).min(1);
