const Joi = require('joi');

// Define schema for user registration (example)
const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
});

exports.validate = (schema) => {
  return (req, res, next) => {
    try {
      const validationResult = schema.validate(req.body);
      if (validationResult.error) {
        throw new Error(validationResult.error.message);
      }
      next();
    } catch (error) {
      console.error('Validation error:', error);
      return res.status(400).json({ message: 'Bad Request - Invalid input', errors: error });
    }
  };
};
