import { Response } from 'express';
import { RESPONSE_CODES, } from '../config/constants';
import { RESPONSE, CustomRequest } from '../interfaces/commonInterfaces';
import { addCategory, categoryAll, categoryDetail, deleteCategory, editCategory, isCategoryExist, } from '../services/categoryService';
import { RESPONSE_MESSAGES } from '../utils/responseMessage';

// Add category
export const addCategoryController = async (req: CustomRequest, res: Response) => {
    try {
        const body: any = req.body;
        body.type = "name"
        let response = await isCategoryExist(body);

        if (!response.status) {
            addCategory(body);
            response = {
                status: 1,
                status_code: RESPONSE_CODES.POST,
                message: RESPONSE_MESSAGES.categoryAdded,
            }
        }
        else {
            response.status = 0;
            response.status_code = RESPONSE_CODES.ALREADY_EXIST;
        }
        return res.status(RESPONSE_CODES.POST).json(response);
    } catch (error) {
        return res.status(RESPONSE_CODES.ERROR).json({
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        });
    }
}

// Category detail
export const categoryDetailController = async (req: CustomRequest, res: Response) => {
    try {
        const body: any = req.query;
        let response = await categoryDetail(body);

        return res.status(RESPONSE_CODES.POST).json(response);

    } catch (error) {
        return res.status(RESPONSE_CODES.ERROR).json({
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        });
    }
}

// Category get all
export const categoryAllController = async (req: CustomRequest, res: Response) => {
    try {
        const body: any = req.query;
        let response = await categoryAll(body);

        return res.status(RESPONSE_CODES.POST).json(response);

    } catch (error) {
        return res.status(RESPONSE_CODES.ERROR).json({
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        });
    }
}

// Edit category
export const editCategoryController = async (req: CustomRequest, res: Response) => {
    try {
        const body: any = req.body;
        let response: RESPONSE = await isCategoryExist(body);

        if (!response.status) {
            response.status_code = RESPONSE_CODES.BAD_REQUEST;
            response.message = RESPONSE_MESSAGES.invalidId;
            return res.status(response.status_code).json(response);
        }

        body.type = "edit"
        response = await isCategoryExist(body);

        if (response.status) {
            response = {
                status: 0,
                status_code: RESPONSE_CODES.ALREADY_EXIST,
                message: RESPONSE_MESSAGES.categoryNameExist,
            };
            return res.status(response.status_code).json(response);
        }

        response = await editCategory(body);
        return res.status(response.status_code).json(response);
        
    } catch (error) {
        return res.status(RESPONSE_CODES.ERROR).json({
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        });
    }
}

// Delete category
export const deleteCategoryController = async (req: CustomRequest, res: Response) => {
    try {
        const body: any = req.body;
        let response: RESPONSE = await  deleteCategory(body);
        return res.status(response.status_code).json(response);
        
    } catch (error) {
        return res.status(RESPONSE_CODES.ERROR).json({
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        });
    }
}