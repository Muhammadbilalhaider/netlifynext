import express, { Router } from "express";
import { companyAddSchema, companyAllSchema } from "../validators/companies";
import { addCompanyController, companyAllController } from "../controllers/companyController";

export const companyRoute = (): Router => {
    const router = express.Router();
    router.post('/add', companyAddSchema, addCompanyController);
    router.get('/all', companyAllSchema, companyAllController);

    return router;
};