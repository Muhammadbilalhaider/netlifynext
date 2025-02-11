import { Response } from 'express';
import { RESPONSE_CODES, } from '../config/constants';
import { RESPONSE, CustomRequest } from '../interfaces/commonInterfaces';
import { fetchCountryState } from '../services/stateServices';
// Get all states
export const getAllCountryStateController = async (req: CustomRequest, res: Response) => {
    try {

        const body = req.query;
        const response: RESPONSE = await fetchCountryState(body);

        return res.status(response.status_code).json(response);

    } catch (error) {
        return res.status(RESPONSE_CODES.ERROR).json({
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        });
    }
}