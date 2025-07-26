import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.alphanum': 'Username must only contain alphanumeric characters',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username must not exceed 50 characters',
      'any.required': 'Username is required'
    }),
  masterPassword: Joi.string()
    .min(8)
    .max(128)
    .required()
    .messages({
      'string.min': 'Master password must be at least 8 characters long',
      'string.max': 'Master password must not exceed 128 characters',
      'any.required': 'Master password is required'
    })
});

export const loginSchema = Joi.object({
  username: Joi.string()
    .required()
    .messages({
      'any.required': 'Username is required'
    }),
  masterPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Master password is required'
    })
});

export const createAccountSchema = Joi.object({
  username: Joi.string()
    .required()
    .max(100)
    .messages({
      'string.max': 'Account username must not exceed 100 characters',
      'any.required': 'Account username is required'
    }),
  password: Joi.string()
    .required()
    .max(256)
    .messages({
      'string.max': 'Account password must not exceed 256 characters',
      'any.required': 'Account password is required'
    }),
  comment: Joi.string()
    .optional()
    .max(500)
    .allow('')
    .messages({
      'string.max': 'Comment must not exceed 500 characters'
    }),
  masterPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Master password is required'
    })
});

export const updateAccountSchema = Joi.object({
  username: Joi.string()
    .optional()
    .max(100)
    .messages({
      'string.max': 'Account username must not exceed 100 characters'
    }),
  password: Joi.string()
    .optional()
    .max(256)
    .messages({
      'string.max': 'Account password must not exceed 256 characters'
    }),
  comment: Joi.string()
    .optional()
    .max(500)
    .allow('')
    .messages({
      'string.max': 'Comment must not exceed 500 characters'
    }),
  masterPassword: Joi.string()
    .optional()
    .messages({
      'string.base': 'Master password must be a string'
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});
