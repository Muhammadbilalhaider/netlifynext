import { Response } from 'express';
import { RESPONSE_CODES, } from '../config/constants';
import { RESPONSE, CustomRequest } from '../interfaces/commonInterfaces';
import { fetchStateCity } from '../services/cityServices';


// Get all cities
export const getAllCountryCityController = async (req: CustomRequest, res: Response) => {
    try {

        const body = req.query;
        const response: RESPONSE = await fetchStateCity(body);

        return res.status(response.status_code).json(response);

    } catch (error) {
        return res.status(RESPONSE_CODES.ERROR).json({
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        });
    }
}