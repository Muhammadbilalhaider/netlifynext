import { Response } from 'express';

import { RESPONSE_CODES, } from '../config/constants';
import { CustomRequest } from '../interfaces/commonInterfaces';
import { addTechnology, isTechnologyExist, technologiesAll } from '../services/technologyServices';



// Add technologies
export const addTechnologiesController = async (req: CustomRequest, res: Response) => {
    try {
        const body: any = req.body;
        body.type = "name"
        let response = await isTechnologyExist(body);

        if (!response.status) {
            response = await addTechnology(body);
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

// Technologies get all
export const technologiesAllController = async (req: CustomRequest, res: Response) => {
    try {
        const body: any = req.query;
        let response = await technologiesAll(body);

        return res.status(RESPONSE_CODES.POST).json(response);

    } catch (error) {
        return res.status(RESPONSE_CODES.ERROR).json({
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        });
    }
}