// src/models/subscription.model.ts
import { Schema, model, Document, Types } from 'mongoose';
import { Collection } from '../config/constants';

export interface ISubscription extends Document {
  subscriptionId: string;
  customerId: string;
  userId: Types.ObjectId;
  planId: string;
  status: number;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  isDeleted: boolean;
  createdAt: number;
  updatedAt: number;
}

const subscriptionSchema = new Schema({
  subscriptionId: {
    type: String,
    required: true,
    // unique: true  // This already creates an index
  },
  customerId: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: Collection.userTableName,
    required: true
  },
  planId: {
    type: String,
    ref: Collection.plansTableName,
    required: true
  },
  status: {
    type: Number,
    default: 1
  },
  currentPeriodStart: {
    type: Number,
    required: true
  },
  currentPeriodEnd: {
    type: Number,
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: {
    currentTime: () => Date.now()
  },
  versionKey: false
});

// // Indexes - removed duplicate subscriptionId index
// subscriptionSchema.index({ customerId: 1 });
// subscriptionSchema.index({ userId: 1 });
// subscriptionSchema.index({ planId: 1 });
// subscriptionSchema.index({ status: 1 });
// subscriptionSchema.index({ currentPeriodEnd: 1 });

export const Subscription = model<ISubscription>(Collection.subscriptions, subscriptionSchema,Collection.subscriptions);