// src/models/jobPreferences.model.ts
import { Schema, model, Document, Types } from "mongoose";
import { Collection } from "../config/constants";

// Interface for Job Preferences Document
export interface IJobPreferences extends Document {
  // userId: Types.ObjectId;
  // primaryJobTitles: string[];
  // secondaryJobTitles: string[];
  // jobLocationPreferences: string[];
  // createdAt: number;
  // updatedAt: number;
  userId: Types.ObjectId;
  resume: string;
  jobPreferences: string;
  primaryJobTitles: string[];
  secondaryJobTitles: string[];
  
  requiredTechnologies: string[];
  workType: string[];
  jobLocations: string[];
  
  createdAt: number;
  updatedAt: number;
}


// Job Preferences Schema
const jobPreferencesSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: Collection.userTableName,
      required: true,
    },
    resume: {
      type: String,
      trim: true,
    },
    jobPreferences: {
      type: String,
      trim: true,
    },
    primaryJobTitles: [
      {
        type: String,
        trim: true,
      },
    ],
    secondaryJobTitles: [
      {
        type: String,
        trim: true,
      },
    ],
    requiredTechnologies: [
      {
        type: String,
        trim: true,
      },
    ],
    workType: [
      {
        type: String,
        trim: true,
      },
    ],
    jobLocations: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: {
      currentTime: () => Date.now(),
    },
    versionKey: false,
  }
);

// Indexes
jobPreferencesSchema.index({ userId: 1 }, { unique: true });
jobPreferencesSchema.index({ createdAt: 1 });

// Export Job Preferences model
export const JobPreference = model<IJobPreferences>(
  Collection.jobPreferences,
  jobPreferencesSchema,
  Collection.jobPreferences
);
