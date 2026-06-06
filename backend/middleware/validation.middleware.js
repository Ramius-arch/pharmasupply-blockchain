const Joi = require('joi');

// ─── Auth Schemas ─────────────────────────────────────────────────────────────

const registerSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(50).required()
    .messages({ 'string.empty': 'First name is required' }),
  lastName: Joi.string().trim().min(1).max(50).required()
    .messages({ 'string.empty': 'Last name is required' }),
  email: Joi.string().email().required()
    .messages({ 'string.email': 'A valid email is required' }),
  password: Joi.string().min(6).max(128).required()
    .messages({ 'string.min': 'Password must be at least 6 characters' }),
  role: Joi.string().valid('admin', 'supplier', 'user').optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required()
    .messages({ 'string.email': 'A valid email is required' }),
  password: Joi.string().required()
    .messages({ 'string.empty': 'Password is required' })
});

// ─── Product Schemas ──────────────────────────────────────────────────────────

const createProductSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().allow('').optional(),
  manufacturer: Joi.string().allow('').optional(),
  supplier: Joi.string().required() // ObjectId as string
    .messages({ 'string.empty': 'Supplier is required' }),
  category: Joi.string().required(),
  unitPrice: Joi.number().positive().required()
    .messages({ 'number.positive': 'Unit price must be a positive number' }),
  quantityInStock: Joi.number().integer().min(0).default(0),
  dosageForm: Joi.string().allow('').optional(),
  strength: Joi.string().allow('').optional(),
  pharmaceuticalCode: Joi.string().allow('').optional(),
  batchNumber: Joi.string().required()
    .messages({ 'string.empty': 'Batch number is required for pharma products' }),
  expiryDate: Joi.date().iso().greater('now').required()
    .messages({ 'date.greater': 'Expiry date must be in the future' }),
  manufacturingDate: Joi.date().iso().optional(),
  storageConditions: Joi.string().allow('').optional(),
  requiresPrescription: Joi.boolean().default(false)
});

// ─── Order Schemas ────────────────────────────────────────────────────────────

const createOrderSchema = Joi.object({
  supplier: Joi.string().required()
    .messages({ 'string.empty': 'Supplier is required' }),
  items: Joi.array().items(
    Joi.object({
      product: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required()
        .messages({ 'number.min': 'Quantity must be at least 1' })
    })
  ).min(1).required()
    .messages({ 'array.min': 'Order must contain at least one item' }),
  totalAmount: Joi.number().positive().required(),
  shippingAddress: Joi.object({
    street: Joi.string().allow('').optional(),
    city: Joi.string().allow('').optional(),
    state: Joi.string().allow('').optional(),
    zipCode: Joi.string().allow('').optional()
  }).optional(),
  paymentStatus: Joi.string().valid('unpaid', 'paid', 'refunded').optional()
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled').required()
    .messages({ 'any.only': 'Status must be one of: pending, processing, shipped, delivered, cancelled' })
});

// ─── Validation Middleware Factory ────────────────────────────────────────────

/**
 * Generic validation middleware.
 * @param {Joi.ObjectSchema} schema - Joi schema to validate against.
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const messages = error.details.map(detail => detail.message);
      return res.status(400).json({
        message: 'Validation failed',
        errors: messages
      });
    }
    req.body = value; // Replace body with validated/sanitized values
    next();
  };
};

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  createProductSchema,
  createOrderSchema,
  updateStatusSchema
};
