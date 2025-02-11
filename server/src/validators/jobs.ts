import { Request,NextFunction, Response } from "express";
import Joi from "joi";
import { JOB_STATUS, RESPONSE_CODES } from "../config/constants";



export const jobsAllSchema = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        search: Joi.string().optional().messages({ 'any.required': 'Search is required' }),
        // page: Joi.number().required().messages({ 'any.required': 'Page is required' }),
        // limit: Joi.number().required().messages({ 'any.required': 'Limit is required' }),
        date: Joi.string().regex(/^\d{2}-\d{2}-\d{4}$/).required() .messages({
            'any.required': "Date is required",
            'string.empty': 'Date cannot be empty',
            'string.pattern.base': 'Date must be in the format DD-MM-YYYY'
        }),
        //   endDate: Joi.string().regex(/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/).optional().messages({
        //     'any.required': "endDate is required",
        //     'string.empty': 'endDate cannot be empty',
        //     'string.pattern.base': 'endDate must be in the format DD-MM-YYYY'
        // })
        
    });

    const { error } = schema.validate(req.query);

    if (error) {
        return res.status(RESPONSE_CODES.BAD_REQUEST).json({
            status: 0,
            statusCode: RESPONSE_CODES.BAD_REQUEST,
            message: error.message,
        });
    }

    next();
};


export const appliedAndFollowedJobSchema = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        search: Joi.string().optional().messages({ 'any.required': 'Search is required' }),
        page: Joi.number().required().messages({ 'any.required': 'Page is required' }),
        type: Joi.number().valid(JOB_STATUS.applied,JOB_STATUS.followed).required().messages({ 'any.required': 'Type is required and must be 1.Applied,2.Follow-up' }),
        limit: Joi.number().required().messages({ 'any.required': 'Limit is required' }),
        // type : Joi.number().required().valid(1,2).messages({ 'any.required': 'type is required' }),
        startDate: Joi.string().regex(/^\d{2}-\d{2}-\d{4}$/).optional() .messages({
            'any.required': "startDate is required",
            'string.empty': 'startDate cannot be empty',
            'string.pattern.base': 'startDate must be in the format DD-MM-YYYY'
        }),
        endDate: Joi.string().regex(/^\d{2}-\d{2}-\d{4}$/).optional().messages({
            'any.required': "endDate is required",
            'string.empty': 'endDate cannot be empty',
            'string.pattern.base': 'endDate must be in the format DD-MM-YYYY'
        })
    });

    const { error } = schema.validate(req.query);

    if (error) {
        return res.status(RESPONSE_CODES.BAD_REQUEST).json({
            status: 0,
            statusCode: RESPONSE_CODES.BAD_REQUEST,
            message: error.message,
        });
    }

    next();
};


export const updateStatus = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        jobId: Joi.string().required().messages({ 'any.required': 'Job Id is required' }),
        status: Joi.number().valid(1,2,3,4),
        notes : Joi.string().required().allow("").messages({ 'any.required': 'Notes is required' }),
        application_status : Joi.string().optional().allow("").messages({ 'any.required': 'Application status is required' })
        // notes: Joi.when('status', {
        //     is: 3,
        //     then: Joi.forbidden(),
        //     otherwise: Joi.string().required().allow("")
        //   }).messages({ 'any.required': 'Notes is required' }),
        
      
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(RESPONSE_CODES.BAD_REQUEST).json({
            status: 0,
            statusCode: RESPONSE_CODES.BAD_REQUEST,
            message: error.message,
        });
    }

    next();
};

export const updateJobSchema = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        _id: Joi.string().required().messages({ 'any.required': 'Job Application Id is required' }),
        notes: Joi.string().required().allow("").messages({ 'any.required': 'Notes is required' }),
      
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(RESPONSE_CODES.BAD_REQUEST).json({
            status: 0,
            statusCode: RESPONSE_CODES.BAD_REQUEST,
            message: error.message,
        });
    }

    next();
};