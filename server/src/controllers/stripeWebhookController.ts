import { Response } from "express";
import stripePackage from "stripe";

import { RESPONSE_CODES } from "../config/constants";
import { CustomRequest } from "../interfaces/commonInterfaces";
import {
  addPlanSInDBService,
  editPlanSInDBService,
  inactiveAllPlansService,
} from "../services/planServices";
import {
  addAndUpdateSubscriptionService,
} from "../services/stripeServices";
import { updateUserStatusService } from "../services/userServices";
import dotenv from 'dotenv';
dotenv.config();

const stripe = new stripePackage(process.env.STRIPE_SECRET_KEY);

// Stripe webhook
export const stripeWebhookController = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const event = req.body;

    const plansInfo = event.data.object;
    console.log("even type---------------", event);

    // Handle the event
    switch (event.type) {
      case "price.created":
        if (parseInt(plansInfo.metadata.status)) {
          inactiveAllPlansService();
        }
        addPlanSInDBService(plansInfo);

        break;
      case "price.updated":
        // if (parseInt(plansInfo.metadata.status)) {

        //     await inactiveAllPlansService();
        // }
        editPlanSInDBService(plansInfo);
        break;
      case "customer.subscription.created":

        await addAndUpdateSubscriptionService(plansInfo)
        
        break;
      case "checkout.session.completed":
        console.log("checkout.session.completed", plansInfo);
        addAndUpdateSubscriptionService(plansInfo);
        plansInfo.type = "active_subscription";
        updateUserStatusService(plansInfo);

        break;
      case 'customer.subscription.deleted':

      plansInfo.type = "expired_subscription";
      const subscription = await addAndUpdateSubscriptionService(plansInfo);
      plansInfo.metadata.userId = subscription.userId.toString() ;
        updateUserStatusService(plansInfo);

      break ;
      // ... handle other event types
      default:
      // console.log(`Unhandled event type ${event.type}`);
    }

    return res.status(RESPONSE_CODES.GET).json({ received: true });
  } catch (error) {
    console.log("error---------stripeWebhookController---------", error);
    return res.status(RESPONSE_CODES.ERROR).json({
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    });
  }
};
