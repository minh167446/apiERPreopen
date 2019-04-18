import Joi from 'joi';

export default {
  validateBody(body) {
    const schema = Joi.object().keys({
      fullname: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      password: Joi.string().allow(''),
      manager: Joi.optional().allow(''),
      departments: Joi.array()
        .items()
        .required(),
      user_create: Joi.string(),
    });
    const { value, error } = Joi.validate(body, schema);
    if (error && error.details) {
      return { error };
    }
    return { value };
  },
  validateLogin(body) {
    const schema = Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().allow(''),
    });
    const { value, error } = Joi.validate(body, schema);
    if (error && error.details) {
      return { error };
    }
    return { value };
  },
  comparePassword(password, dbPassword) {
    return (password == dbPassword);
  },
};
