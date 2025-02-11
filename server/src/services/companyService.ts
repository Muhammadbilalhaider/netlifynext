import { RESPONSE_CODES, Collection } from '../config/constants';
// import { count, find, insert, } from '../utils/DAO';
import { RESPONSE } from '../interfaces/commonInterfaces';
import moment from 'moment-timezone';
import { ObjectId } from 'mongodb';
import { RESPONSE_MESSAGES } from '../utils/responseMessage';
import { getCompanyPayload, addCompanyPayload } from '../interfaces/companyInterface';
import { Company } from '../models/company.model';


// Check company exist
export const isCompanyExist = async (payload: getCompanyPayload) => {
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

        const companyInfo = await Company.countDocuments(condition);

        if (companyInfo) {
            response = {
                status: 1,
                status_code: RESPONSE_CODES.GET,
                message: RESPONSE_MESSAGES.companyIdExist,
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

//Add company 
export const addCompany = async (payload: addCompanyPayload) => {
    try {
        const currentDate = parseInt(moment().tz(process.env.Timezone).format('x'));
        const companyInfo = {
            name: payload?.name.toLowerCase(),
            createAt: currentDate,
            isDeleted: false,
            updatedAt: currentDate
        }
        const companyId = await Company.create(companyInfo);

        const response = {
            status: 1,
            status_code: RESPONSE_CODES.POST,
            message: RESPONSE_MESSAGES.companyAdded,
            data: {
                _id: companyId._id,
                ...companyInfo
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

// Get all company
export const companyAll = async (payload: getCompanyPayload) => {
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


        const companyInfo = await Company.find(condition)
        .select({ 
            name: 1, 
            isScam: 1, 
            verifiedScam: 1 
        })
        .skip(page.skip)
        .limit(page.limit)
        //@ts-ignore
        .sort(sort);

        response = {
            status: 1,
            status_code: RESPONSE_CODES.GET,
            message: RESPONSE_MESSAGES.companyAll,
            data: companyInfo
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