import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const getUserDetailSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    _id: Joi.string()
      .optional()
      .hex()
      .length(24)
      .messages({ "any.required": "_id is required" }),
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

export const userRegisterSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    firstName: Joi.string()
      .required()
      .messages({ "any.required": "First name is required." }),
    lastName: Joi.number()
      .required()
      .messages({ "any.required": "Last name is required." }),
    // number: Joi.string().required().messages({ 'any.required': 'Number is required.' }),
    // country: Joi.string().required().messages({ 'any.required': 'Country is required.' }),
    // DOB: Joi.string().required().messages({ 'any.required': 'DOB is required.' }),
    email: Joi.string()
      .email()
      .required()
      .messages({ "any.required": "Email is required." }),
    password: Joi.string()
      .min(8)
      .pattern(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()-=_+:;"'{}|[\]<>/?.,`~]).*$/
      )
      .messages({
        "string.base": "Password must be a string",
        "string.empty": "Password cannot be empty",
        "string.min": "Password must be at least {#limit} characters long",
        "string.max": "Password cannot be longer than {#limit} characters",
        "string.pattern.base":
          "Password must include at least one letter, one digit, and one special character",
      })
      .required(),
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

export const userRegisterStep3Schema = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    _id: Joi.string().hex().length(24).required().messages({
      "any.required": "_id is required",
      "string.hex": "_id must be a valid hex string",
      "string.length": "_id must be 24 characters long",
    }),
    jobLocationPreference: Joi.array()
      .items(Joi.string().valid("Hybrid", "Remote", "On-Location"))
      .required()
      .messages({ "any.required": "Job location preference is required" }),
    jobLocations: Joi.array()
      .items(Joi.string())
      .required()
      .messages({ "any.required": "Job Location is required" }),
    primaryJobTitle: Joi.array()
      .items(Joi.string())
      .required()
      .messages({ "any.required": "Primary job title is required" }),
    secondaryJobTitle: Joi.array()
      .items(Joi.string())
      .required()
      .messages({ "any.required": "Secondary job title is required" }),
    excludedJobTitleKeywords: Joi.array()
      .items(Joi.string())
      .required()
      .messages({ "any.required": "Excluded job title keywords are required" }),
    avoidedJobTitleWords: Joi.array()
      .items(Joi.string())
      .required()
      .messages({ "any.required": "Avoided job title words are required" }),
    excludedCompanies: Joi.array()
      .items(Joi.string())
      .required()
      .messages({ "any.required": "Excluded companies are required" }),
    specificIndustriesTechnologies: Joi.array()
      .items(Joi.string())
      .required()
      .messages({
        "any.required": "Specific industries and technologies are required",
      }),
    excludedIndustriesTechnologies: Joi.array()
      .items(Joi.string())
      .required()
      .messages({
        "any.required": "Excluded industries and technologies are required",
      }),
    // confidentInResume: Joi.string().valid(0, 1).required().messages({ 'any.required': 'Confidence in resume is required' }),
    // personalWebsite: Joi.string().valid(0, 1).required().messages({ 'any.required': 'Personal website information is required' }),
    // interestedInCommunity: Joi.string().valid(0, 1, 2).required().messages({ 'any.required': 'Interest in community is required' }),
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

export const changeStatusSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    _id: Joi.string()
      .required()
      .hex()
      .length(24)
      .messages({ "any.required": "_id is required" }),
    status: Joi.number()
      .valid(0, 1)
      .required()
      .messages({ "any.required": "Status is required and must be 0 or 1" }),
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

export const getAllUsersSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    search: Joi.string()
      .optional()
      .messages({ "any.required": "Search is required" }),
    page: Joi.number()
      .required()
      .messages({ "any.required": "Page is required" }),
    limit: Joi.number()
      .required()
      .messages({ "any.required": "Limit is required" }),
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

export const changePasswordSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    password: Joi.string()
      .min(8)
      .pattern(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()-=_+:;"'{}|[\]<>/?.,`~]).*$/
      )
      .messages({
        "string.base": "Password must be a string",
        "string.empty": "Password cannot be empty",
        "string.min": "Password must be at least {#limit} characters long",
        "string.max": "Password cannot be longer than {#limit} characters",
        "string.pattern.base":
          "Password must include at least one letter, one digit, and one special character",
      })
      .required(),
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

export const updateUserProfileSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    firstName: Joi.string()
      .required()
      .messages({ "any.required": "First name is required." }),
    lastName: Joi.number()
      .required()
      .messages({ "any.required": "Last name is required." }),
    // number: Joi.string().required().messages({ 'any.required': 'Number is required.' }),
    // DOB: Joi.string().required().messages({ 'any.required': 'DOB is required.' }),
    // country: Joi.string().required().messages({ 'any.required': 'Country is required.' })
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

export const userDeleteSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    _id: Joi.string()
      .required()
      .length(24)
      .hex()
      .messages({ "any.required": "_id is required" }),
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
