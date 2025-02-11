import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';



export const configurationAddUpdateSchema = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({ 'any.required': 'Name is required' }),
        type: Joi.number().valid(1).required().messages({ 'any.required':'Type is required and must be 1.'}),
        keys: Joi.object({
            apiToken: Joi.string().required().messages({ 'any.required': 'apiToken is required' }),
            actorId: Joi.string().required().messages({ 'any.required': 'actorId is required' }),
            apiUrl: Joi.string().required().messages({ 'any.required': 'apiUrl is required' }),
            
        })
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

export const getAllConfigurationSchema = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        type: Joi.number().valid(1).optional().messages({ 'any.required':'Type is required and must be 1.'}),
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