import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../interfaces/commonInterfaces';
import { USER_TYPE } from '../config/constants';



export const addPlanSchema = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        title: Joi.string().required().messages({ 'any.required': 'Title is required' }),
        nickname: Joi.string().required().messages({ 'any.required': 'Nickname is required' }),
        interval: Joi.string().required().messages({ 'any.required': 'Interval is required' }),
        intervalCount: Joi.number().required().messages({ 'any.required': 'Interval count is required' }),
        amount: Joi.number().required().messages({ 'any.required': 'Amount is required' }),
        currency: Joi.string().optional().messages({ 'any.optional': 'Currency is optional' }),
        description: Joi.array().required().messages({ 'any.required': 'Description is required' }),
        status: Joi.number().valid(0, 1).required().messages({ 'any.required': 'Status is required and must be 0 or 1' }),
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

export const planAllSchema = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        search: Joi.string().optional().messages({ 'any.required': 'Search is required' }),
        status: Joi.number().optional().messages({ 'any.required': 'Status is required' }),
        page: Joi.number().required().messages({ 'any.required': 'Page is required' }),
        limit: Joi.number().required().messages({ 'any.required': 'Limit is required' }),
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

export const editPlanSchema = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        _id: Joi.string().required().messages({ 'any.required': '_id is required' }),
        // id: Joi.string().required().messages({ 'any.required': 'id is required' }),
        title: Joi.string().required().messages({ 'any.required': 'Title is required' }),
        nickname: Joi.string().required().messages({ 'any.required': 'Nickname is required' }),
        description: Joi.array().required().messages({ 'any.required': 'Description is required' }),
        // interval: Joi.string().required().messages({ 'any.required': 'Interval is required' }),
        // intervalCount: Joi.number().required().messages({ 'any.required': 'Interval count is required' }),
        // amount: Joi.number().required().messages({ 'any.required': 'Amount is required' }),
        // currency: Joi.string().optional().messages({ 'any.optional': 'Currency is optional' }),
        // status: Joi.number().valid(0, 1).required().messages({ 'any.required': 'Status is required and must be 0 or 1' }),
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

export const changePlanStatusSchema = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        _id: Joi.string().required().messages({ 'any.required': '_id is required' }),
        // id: Joi.string().required().messages({ 'any.required': 'id is required' }),
        status: Joi.number().valid(0, 1).required().messages({ 'any.required': 'Status is required and must be 0 or 1' }),
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

export const checkoutSessionSchema = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        // _id: Joi.string().required().length(24).hex().messages({ 'any.required': 'User _id is required' }),
        planId: Joi.string().required().messages({ 'any.required': 'Plan id is required' }),
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

// subscription schema
export const subscriptionAllSchema = (req: CustomRequest, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        type: Joi.number().valid(USER_TYPE.admin,USER_TYPE.user).required(),
        search: Joi.string().optional().messages({ 'any.required': 'Search is required' }),
        page: Joi.when('type', {
            is: 1,
            then:  Joi.number().required().messages({ 'any.required': 'Page is required' }),
            otherwise: Joi.forbidden()
        }),
        limit: Joi.when('type', {
            is: 1,
            then: Joi.number().required().messages({ 'any.required': 'Limit is required' }),
            otherwise: Joi.forbidden()
        }),
        status: Joi.number().optional().valid(1, 2).messages({ 'any.required': 'Status is required' }),
        userId: Joi.string().optional().messages({ 'any.required': 'User id is required' }),
        startDate: Joi.string().regex(/^\d{2}-\d{2}-\d{4}$/).optional().messages({ 'any.required': 'startDate is required' }),
        endDate: Joi.string().regex(/^\d{2}-\d{2}-\d{4}$/).optional().messages({ 'any.required': 'endDate is required' })

    });
    
    const { error } = schema.validate({...req.query, type: req.user.type });

    if (error) {
        return res.status(400).json({
            status: 0,
            statusCode: 400,
            message: error.message,
        });
    }

    next();
};