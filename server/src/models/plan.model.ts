// src/models/plan.model.ts
import { Schema, model, Document } from 'mongoose';
import { Collection } from '../config/constants';

export interface IPlan extends Document {
  _id: string;  // Stripe price ID
  productId: string;
  nickname: string;
  description: string[];
  title: string;
  amount: number;
  currency: string;
  interval: string;
  intervalCount: number;
  status: number;
  isDeleted: boolean;
  createdAt: number;
  updatedAt: number;
}

const planSchema = new Schema({
  _id: {
    type: String,  // Using Stripe price ID as _id
    // required: true
  },
  productId: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true,
    trim: true
  },
  description: [{
    type: String,
    trim: true
  }],
  title: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  interval: {
    type: String,
    required: true,
    trim: true
  },
  intervalCount: {
    type: Number,
    required: true,
    default: 1
  },
  status: {
    type: Number,
    default: 1
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  _id: false,  // Disable auto _id since we're using Stripe price ID
  timestamps: {
    currentTime: () => Date.now()
  },
  versionKey: false
});

// Indexes
planSchema.index({ productId: 1 });
planSchema.index({ status: 1 });
planSchema.index({ amount: 1 });

export const Plan = model<IPlan>(Collection.plansTableName, planSchema,Collection.plansTableName);
