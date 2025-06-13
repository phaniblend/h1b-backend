import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

export const authValidation = {
  register: validateRequest(
    Joi.object({
      firstName: Joi.string().min(2).max(50).required(),
      lastName: Joi.string().min(2).max(50).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required()
    })
  ),

  login: validateRequest(
    Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })
  ),

  forgotPassword: validateRequest(
    Joi.object({
      email: Joi.string().email().required()
    })
  ),

  resetPassword: validateRequest(
    Joi.object({
      token: Joi.string().required(),
      password: Joi.string().min(6).required()
    })
  ),

  resendVerification: validateRequest(
    Joi.object({
      email: Joi.string().email().required()
    })
  ),

  changePassword: validateRequest(
    Joi.object({
      currentPassword: Joi.string().required(),
      newPassword: Joi.string().min(6).required()
    })
  )
}; 