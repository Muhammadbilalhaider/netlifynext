import express, { Router } from "express";
import { configurationAddUpdateSchema, getAllConfigurationSchema } from "../validators/configurationValidator";
import { addUpdateConfigurationController, getAllConfigurationController } from "../controllers/configurationController";

export const  configurationRoute = (): Router => {
    const router = express.Router();
    router.post('/add-update', configurationAddUpdateSchema, addUpdateConfigurationController);
    router.get('/all', getAllConfigurationSchema, getAllConfigurationController);

    return router;
};