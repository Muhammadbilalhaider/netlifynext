// src/models/user.model.ts
import { Schema, model, Document } from 'mongoose';
import { Collection } from '../config/constants';

// Interface for User Document
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  cities: string[];
  status: number;
  type: number;
  linkHash: string | null;
  isVerified: number;
  isSubscribed: number;
  isDeleted: boolean;
  expiryTime?: number;
  otp?: string;
  createdAt: number;    // Automatically handled by Mongoose
  updatedAt: number;    // Automatically handled by Mongoose
}

// User Schema
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  cities: [{
    type: String,
    trim: true
  }],
  status: {
    type: Number,
    default: 0
  },
  type: {
    type: Number,
    default: 2
  },
  linkHash: {
    type: String,
    default: null,
    sparse: true
  },
  isVerified: {
    type: Number,
    default: 0
  },
  isSubscribed: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  
  expiryTime: {
    type: Number,
    default: null
  },
  otp: {
    type: Number,
    default: null
  }
}, {
  timestamps: {
    currentTime: () => Date.now()  // This will save timestamps in milliseconds
  },
  versionKey: false
});

// Indexes
// userSchema.index({ email: 1 }, { unique: true });
// userSchema.index({ createdAt: 1 });
// userSchema.index({ linkHash: 1 }, { sparse: true });

// Export User model
export const User = model<IUser>(Collection.userTableName, userSchema,Collection.userTableName);
