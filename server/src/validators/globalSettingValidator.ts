import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const addUpdateGlobalSchema = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        type: Joi.number().valid(1).required().messages({
            'any.required': 'Type is required',
            'any.only': 'Type must be one of [1]',
        }),
        excludedCompanies: Joi.alternatives().conditional('type', {
            is: 1,
            then: Joi.array().items(
                Joi.string().optional().hex().length(24).messages({ 'any.required': 'Company _id is required' }),
            ).required().messages({
                'any.required': 'excludedCompanies id is required when type is 1.',
            }),
            otherwise: Joi.forbidden().messages({
                'any.unknown': 'excludedCompanies is forbidden when type is not 1.',
            }),
        }),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            status: 0,
            statusCode: 400,
            message: error.details[0].message,
        });
    }

    next();
};
