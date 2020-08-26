const Joi = require('joi');

const schema = Joi.object().keys({
  title: Joi.string().trim().max(100).required(),
  note: Joi.string().trim().required(),
});

module.exports = schema;
