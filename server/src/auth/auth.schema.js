const Joi = require('joi');

const schema = Joi.object().keys({
  fullName: Joi.string()
    .regex(/^([a-zA-Z'-.]+(?: [a-zA-Z'-.]+)?)$/)
    .required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().trim().min(10).required(),
});

const loginSchema = Joi.object().keys({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().trim().min(10).required(),
});

module.exports = {
  schema,
  loginSchema,
};
