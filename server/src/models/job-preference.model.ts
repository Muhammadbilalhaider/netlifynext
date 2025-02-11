// src/models/jobPreferences.model.ts
import { Schema, model, Document, Types } from "mongoose";
import { Collection } from "../config/constants";

// Interface for Job Preferences Document
export interface IJobPreferences extends Document {
  userId: Types.ObjectId;
  primaryJobTitles: string[];
  secondaryJobTitles: string[];
  jobLocationPreferences: string[];
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
    jobLocationPreferences: [
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
