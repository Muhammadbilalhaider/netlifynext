import express, { Router } from "express";
import { dashboardMetrics, getMonthlyRevenueController } from "../controllers/dashboardController";


export const dashBoardRoute = (): Router => {
    const router = express.Router();
    router.get('/metrics',dashboardMetrics);
    router.get('/graph',getMonthlyRevenueController);

    return router;
};
