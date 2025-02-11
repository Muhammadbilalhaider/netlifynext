import express, { Router } from "express";
import { countryAllController, countrySeederController } from "../controllers/countryController";

export const countryRoute = (): Router => {
    const router = express.Router();
    router.get('/seeder', countrySeederController);
    router.get('/all', countryAllController);

    return router;
};
