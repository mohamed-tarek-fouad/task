import Joi from "joi";
import { joiPasswordExtendCore } from "joi-password";
const JoiPassword = Joi.extend(joiPasswordExtendCore);
const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email",
    "string.empty": "Email cannot be an empty field",
    "any.required": "Email is a required field",
  }),
  password: JoiPassword.string()
    .min(8)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .required()
    .messages({
      "string.empty": "Password cannot be an empty field",
      "password.minOfLowercase":
        "Password must contain at least 1 lowercase letter",
      "password.minOfUppercase":
        "Password must contain at least 1 uppercase letter",
      "password.minOfNumeric": "Password must contain at least 1 number",
      "string.min": "Password must be at least 8 characters long",
      "any.required": "Password is a required field",
    }),
  name: Joi.string().min(2).max(24).required().messages({
    "string.empty": "Name cannot be an empty field",
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name must not be more than 24 characters long",
    "any.required": "Name is a required field",
  }),
});

export default registerSchema;
