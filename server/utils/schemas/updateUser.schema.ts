import Joi from "joi";
const updateUserSchema = Joi.object({
  email: Joi.string().email().optional().messages({
    "string.email": "Email must be a valid email",
    "string.empty": "Email cannot be an empty field",
  }),
  name: Joi.string().min(2).max(24).optional().messages({
    "string.empty": "Name cannot be an empty field",
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name must not be more than 24 characters long",
  }),
});

export default updateUserSchema;
