import express, { Router } from "express";
import { addUpdateGlobalSchema } from "../validators/globalSettingValidator";
import { addUpdateGlobalSettingsController, getAllGlobalSettingsController } from "../controllers/globalSettingController";

export const  globalSettingsRoute = (): Router => {
    const router = express.Router();
    router.post('/add-update', addUpdateGlobalSchema, addUpdateGlobalSettingsController);
    router.get('/all', getAllGlobalSettingsController);

    return router;
};