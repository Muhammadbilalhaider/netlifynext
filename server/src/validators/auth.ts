import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { RESPONSE_CODES } from '../config/constants';

export const loginSchema = (req: Request, res: Response, next: NextFunction) => {

  const schema = Joi.object({
    email: Joi.string().email().required().messages({ 'any.required': 'Email is required.', }),
    password: Joi.string().required().messages({ 'any.required': 'Password is required.' }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    throw res.status(RESPONSE_CODES.BAD_REQUEST).json({
      status: 0,
      statusCode: RESPONSE_CODES.BAD_REQUEST,
      message: error.message,
    });
  }

  next();
};

export const forgotPasswordSchema = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({ 'any.required':'Email is required'}),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: 0,
      statusCode: 400,
      message: error.message,
    });
  }

  next();
};

export const userProfileSchema = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    userId: Joi.string().required().hex().length(24).messages({ 'any.required':'User id is required'}),
    linkHash:  Joi.number().required().messages({ 'any.required':'Link hash is required'}),
  });

  const { error } = schema.validate(req.query);

  if (error) {
    return res.status(400).json({
      status: 0,
      statusCode: 400,
      message: error.message,
    });
  }

  next();
};

export const resetPasswordSchema = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    _id: Joi.string().required().hex().length(24).messages({ 'any.required':'_id is required'}),
    linkHash:  Joi.number().required().strict().messages({ 'any.required':'Link hash is required'}),
    password: Joi.string().min(8)
      // .pattern(/[a-zA-Z]/)
      // .pattern(/\d/)
      .pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()-=_+:;"'{}|[\]<>/?.,`~]).*$/)
      .messages({
        'string.base': 'Password must be a string',
        'string.empty': 'Password cannot be empty',
        'string.min': 'Password must be at least {#limit} characters long',
        'string.max': 'Password cannot be longer than {#limit} characters',
        'string.pattern.base': 'Password must include at least one letter, one digit, and one special character',
      }).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: 0,
      statusCode: 400,
      message: error.message,
    });
  }

  next();
};

export const sendOtpSchema = (req: Request, res: Response, next: NextFunction) => {
  
  const schema = Joi.object({
    email: Joi.string().email().required().messages({ 'any.required': 'Email is required.', }),
    type: Joi.number().valid(1).required().messages({ 'any.required':'Type is required and must be 1.'}),
  });
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: 0,
      statusCode: 400,
      message: error.message,
    });
  }

  next();
};

export const otpVerifySchema = (req: Request, res: Response, next: NextFunction) => {
  
  const schema = Joi.object({
    email: Joi.string().email().required().messages({ 'any.required':'Email is required'}),
    otp: Joi.number().required().strict().messages({ 'any.required':'OTP is required'}),
  });
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: 0,
      statusCode: 400,
      message: error.message,
    });
  }

  next();
};

export const checkEmailSchema = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({ 'any.required': 'Email is required.', }),
  });

  const { error } = schema.validate(req.query);

  if (error) {
    return res.status(400).json({
      status: 0,
      statusCode: 400,
      message: error.message,
    });
  }

  next();
};