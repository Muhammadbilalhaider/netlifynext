import { Response } from "express";
import { RESPONSE_CODES } from "../config/constants";
import { CustomRequest, RESPONSE } from "../interfaces/commonInterfaces";
import { getDashboardMetrics } from "../services/dashboardService";
import { getMonthlyRevenue } from "../services/stripeServices";

export const dashboardMetrics = async (req: CustomRequest, res: Response) => {
    try {

        const response: RESPONSE = await getDashboardMetrics();

        let data = response.data;
 
        const monthlyTransactionAnalytics = ((data.totalTransactionsPreviousMonth - data.totalTransactionsMonthBeforePrevious) / 100) * 100;

        const userMonthlyAnalytics = ((data.activeUsers - data.totalUsers) / data.totalUsers) * 100;

        response.data = {
            transactionAnalytics: parseFloat(monthlyTransactionAnalytics.toFixed(2)),
            categoriesCount: data.totalCategories,
            activeUsersCount: data.activeUsers,
            transactionCount: data.totalTransactionsPreviousMonth,
            userAnalytics: parseFloat(userMonthlyAnalytics.toFixed(2)),
            totalJobs: data.totalJobs

        }
        res.status(response.status_code).json(response);

    } catch (error) {

        return res.status(RESPONSE_CODES.ERROR).json({
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        });
    }
}
// Get all Subscriptions 
export const getMonthlyRevenueController = async (req: CustomRequest, res: Response) => {
    try {
        const query: any = req.query;


        const response = await getMonthlyRevenue();


        return res.status(response.status_code).json(response);

    } catch (error) {
        return res.status(RESPONSE_CODES.ERROR).json({
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        });
    }
}