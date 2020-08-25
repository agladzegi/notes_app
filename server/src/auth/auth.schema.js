const Joi = require('joi');

const schema = Joi.object({
  fullName: Joi.string()
    .regex(/^([a-zA-Z'-.]+(?: [a-zA-Z'-.]+)?)$/)
    .required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().trim().min(10).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().trim().min(10).required(),
});

module.exports = {
  schema,
  loginSchema,
};
