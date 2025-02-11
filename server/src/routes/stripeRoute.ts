import express, { Router } from "express";
import { addPlanController, changePlanStatusController, checkoutSessionController, editPlanController, plansAllController, subscriptionAllController } from "../controllers/stripeController";
import { addPlanSchema, changePlanStatusSchema, checkoutSessionSchema, editPlanSchema, planAllSchema, subscriptionAllSchema } from "../validators/stripeValidator";
import { stripeWebhookController } from "../controllers/stripeWebhookController";

export const  stripeRoute = (): Router => {
    const router = express.Router();
    router.post('/webhook',  stripeWebhookController);

    // Api's for stripe plans
    router.post('/plan/add', addPlanSchema, addPlanController);
    router.get('/plan/all', planAllSchema, plansAllController);
    router.put('/plan/edit', editPlanSchema, editPlanController);
    router.put('/plan/change-status',  changePlanStatusController);

    // Api's for stripe subscription
    router.post('/checkout-session', checkoutSessionSchema, checkoutSessionController);
    router.get('/subscription/all',subscriptionAllSchema,subscriptionAllController )
    
    return router;
};