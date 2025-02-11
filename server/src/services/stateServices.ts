import { RESPONSE_CODES, Collection } from '../config/constants';
// import { findAll, } from '../utils/DAO';
import { RESPONSE } from '../interfaces/commonInterfaces';
import { State } from '../models';
import { RESPONSE_MESSAGES } from '../utils/responseMessage';


// get all country state Service
export const fetchCountryState = async (payload) => {
    try {
        let response = {};

        // Comma-separated IDs string
        const idsString = payload.countryId;

        // Convert the string of IDs into an array of strings
        const idsArray = idsString?.split(',');

        // Convert each ID in the array back to a string
        const stringIdsArray = idsArray?.map(id => id.toString());

        const condition = {
            countryId: {
                $in: stringIdsArray
            }
        }

        const states = await State.find(condition, {}, {});

        response = {
            status: 1,
            status_code: RESPONSE_CODES.GET,
            message: RESPONSE_MESSAGES.stateListing,
            data: states
        };

        return response

    } catch (error) {
        throw {
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        };
    }

};