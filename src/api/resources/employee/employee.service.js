import Joi from 'joi';

export default {
  validateBody(body) {
    const schema = Joi.object().keys({
      fullname: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      manager: Joi.optional().allow(''),
      departments: Joi.array()
        .items()
        .required(),
    });
    const { value, error } = Joi.validate(body, schema);
    if (error && error.details) {
      return { error };
    }
    return { value };
  },
};
