import { Response } from 'express';
import { RESPONSE_CODES, } from '../config/constants';
import { CustomRequest } from '../interfaces/commonInterfaces';
import { addCompany, companyAll, isCompanyExist } from '../services/companyService';



// Add company
export const addCompanyController = async (req: CustomRequest, res: Response) => {
    try {
        const body: any = req.body;
        body.type = "name"
        let response = await isCompanyExist(body);

        if (!response.status) {
            response = await addCompany(body);
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

// Company get all
export const companyAllController = async (req: CustomRequest, res: Response) => {
    try {
        const body: any = req.query;
        let response = await companyAll(body);

        return res.status(RESPONSE_CODES.POST).json(response);

    } catch (error) {
        return res.status(RESPONSE_CODES.ERROR).json({
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        });
    }
}