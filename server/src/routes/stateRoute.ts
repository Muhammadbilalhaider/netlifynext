import express, { Router } from "express";
import { getAllCountryStateController } from "../controllers/stateController";

export const stateRoute = (): Router => {
    const router = express.Router();
    router.get('/all', getAllCountryStateController);

    return router;
};
