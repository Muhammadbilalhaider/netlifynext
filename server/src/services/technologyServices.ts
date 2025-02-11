import { RESPONSE_CODES, Collection } from '../config/constants';
// import { count, find, insert, } from '../utils/DAO';
import { RESPONSE } from '../interfaces/commonInterfaces';
import moment from 'moment-timezone';
import { ObjectId } from 'mongodb';
import { RESPONSE_MESSAGES } from '../utils/responseMessage';
import { addTechnologyPayload, getTechnologyPayload } from '../interfaces/technologyInterface';
import { Technology } from '../models/technology.model';


// Check technologies exist
export const isTechnologyExist = async (payload: getTechnologyPayload) => {
    try {
        let response: RESPONSE
        let condition = {}

        if (payload.type == "name") {
            condition = {
                name :  { $regex: payload.name, $options: 'i' },
                isDeleted: false
            }
        } else if (payload.type == "edit") {
            condition = {
                _id: { $ne: new ObjectId(payload._id) },
                name: payload.name.toLowerCase(),
                isDeleted: false
            }
        }
        else {
            condition = {
                _id: new ObjectId(payload._id),
                isDeleted: false
            }
        }

        const technologyInfo = await Technology.countDocuments(condition);

        if (technologyInfo) {
            response = {
                status: 1,
                status_code: RESPONSE_CODES.GET,
                message: RESPONSE_MESSAGES.technologyIdExist,
            };
        }
        else {
            response = {
                status: 0,
                status_code: RESPONSE_CODES.NOT_FOUND,
                message: RESPONSE_MESSAGES.noDataFound,
            };
        }

        return response;

    } catch (error) {
        throw {
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        };
    }
};

//Add technologies 
export const addTechnology = async (payload: addTechnologyPayload) => {
    try {
        const currentDate = parseInt(moment().tz(process.env.Timezone).format('x'));
        const technologyInfo = {
            name: payload?.name.toLowerCase(),
            createAt: currentDate,
            isDeleted: false,
            updatedAt: currentDate
        }
        const techInfo = await Technology.create(technologyInfo);

        const response = {
            status: 1,
            status_code: RESPONSE_CODES.POST,
            message: RESPONSE_MESSAGES.technologyAdded,
            data: {
                _id: techInfo._id
            }
        }

        return response

    } catch (error) {
        throw {
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        };
    }
}

// Get all technologies
export const technologiesAll = async (payload: getTechnologyPayload) => {
    try {
        let response: RESPONSE;

        const condition: any = {
            isDeleted: false
        };

        if (payload.search) {
            condition.name = { $regex: payload.search, $options: 'i' };
        }

        const pageNo = payload.page;
        const limit = payload.limit ? parseInt(payload.limit) : 100;

        const skip = (pageNo - 1) * limit;
        const page = {
            skip: skip,
            limit: limit
        };



        const sort = {
            updatedAt: -1
        }


        // const technologyInfo = await Technology.find(Collection.technologiesTableName, condition, {}, page, sort);
        const technologyInfo = await Technology.find(condition)
            .select({ name: 1, isDeleted: 1 }) // field selection
            .skip(page.skip)
            .limit(page.limit)
            //@ts-ignore
            .sort(sort);
        response = {
            status: 1,
            status_code: RESPONSE_CODES.GET,
            message: RESPONSE_MESSAGES.technologyAll,
            data: technologyInfo
        };

        return response;

    } catch (error) {
        throw {
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        };
    }
};