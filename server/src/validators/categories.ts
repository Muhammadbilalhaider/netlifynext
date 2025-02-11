import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';



export const categoryAddSchema = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({ 'any.required': 'Name is required' }),
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

export const categoryDetailSchema = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        _id: Joi.string().required().length(24).hex().messages({ 'any.required': '_id is required' }),
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

export const categoryAllSchema = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        search: Joi.string().optional().messages({ 'any.required': 'Search is required' }),
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

export const categoryEditSchema = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        _id: Joi.string().required().length(24).hex().messages({ 'any.required': '_id is required' }),
        name: Joi.string().required().messages({ 'any.required': 'Name is required' }),
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

export const categoryDeleteSchema = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        _id: Joi.string().required().length(24).hex().messages({ 'any.required': '_id is required' })
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