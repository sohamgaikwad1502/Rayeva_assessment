const Joi = require('joi');

const categoryGeneratorSchema = Joi.object({
  product_name: Joi.string().trim().min(2).max(200).required().messages({
    'string.empty': 'Product name is required',
    'string.min': 'Product name must be at least 2 characters',
    'any.required': 'Product name is required',
  }),
  description: Joi.string().trim().max(1000).optional().allow(''),
  material: Joi.string().trim().max(200).optional().allow(''),
  usage: Joi.string().trim().max(200).optional().allow(''),
  brand: Joi.string().trim().max(100).optional().allow(''),
});

const b2bProposalSchema = Joi.object({
  company_name: Joi.string().trim().min(2).max(200).required().messages({
    'string.empty': 'Company name is required',
    'any.required': 'Company name is required',
  }),
  industry: Joi.string().trim().min(2).max(200).required().messages({
    'string.empty': 'Industry is required',
    'any.required': 'Industry is required',
  }),
  budget: Joi.number().positive().min(100).max(10000000).required().messages({
    'number.base': 'Budget must be a number',
    'number.positive': 'Budget must be positive',
    'number.min': 'Budget must be at least $100',
    'any.required': 'Budget is required',
  }),
  sustainability_goals: Joi.string().trim().max(1000).optional().allow(''),
  required_products: Joi.array()
    .items(Joi.string().trim().min(1).max(200))
    .min(1)
    .max(20)
    .required()
    .messages({
      'array.min': 'At least one product category is required',
      'any.required': 'Required products list is required',
    }),
});

const impactReportSchema = Joi.object({
  order_id: Joi.string().trim().required(),
  products: Joi.array().items(Joi.string().trim()).min(1).required(),
  quantities: Joi.array().items(Joi.number().positive()).min(1).required(),
  materials: Joi.array().items(Joi.string().trim()).min(1).required(),
});

const supportBotSchema = Joi.object({
  message: Joi.string().trim().min(1).max(2000).required(),
  order_id: Joi.string().trim().optional(),
  user_phone: Joi.string().trim().optional(),
  conversation_history: Joi.array()
    .items(
      Joi.object({
        role: Joi.string().valid('user', 'bot').required(),
        content: Joi.string().required(),
      })
    )
    .optional(),
});

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const details = error.details.map((d) => d.message);
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        details,
      },
    });
  }

  req.body = value;
  next();
};

module.exports = {
  categoryGeneratorSchema,
  b2bProposalSchema,
  impactReportSchema,
  supportBotSchema,
  validate,
};
