import * as Joi from 'joi';

export const updateUserModel = Joi.object().keys({
    firstName: Joi.string().trim().min(1).max(30),
    lastName: Joi.string().trim().min(1).max(30),
    password: Joi.string().trim().min(6).max(30)
}).min(1);
