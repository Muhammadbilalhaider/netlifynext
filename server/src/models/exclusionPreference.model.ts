// src/models/exclusionPreferences.model.ts
import { Schema, model, Document, Types } from 'mongoose';
import { Collection } from '../config/constants';

// Interface for Exclusion Preferences Document
export interface IExclusionPreference extends Document {
  userId: Types.ObjectId;
  excludedJobTitleKeywords: string[];
  avoidedJobTitleWords: string[];
  excludedCompanies: string[];
  excludedDescriptionKeywords: string[];
  requiredDescriptionKeywords: string[];
  createdAt: number;
  updatedAt: number;
}

// Exclusion Preferences Schema
const exclusionPreferencesSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: Collection.userTableName,
    required: true
  },
  excludedJobTitleKeywords: [{
    type: String,
    trim: true
  }],
  excludedCompanies: [{
    type: String,
    trim: true
  }],
  avoidedJobTitleWords: [{
    type: String,
    trim: true
  }],
  excludedDescriptionKeywords: [{
    type: String,
    trim: true
  }],
  requiredDescriptionKeywords: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: {
    currentTime: () => Date.now()
  },
  versionKey: false
});

// Indexes
exclusionPreferencesSchema.index({ userId: 1 }, { unique: true });
exclusionPreferencesSchema.index({ createdAt: 1 });

// Export Exclusion Preferences model
export const ExclusionPreference = model<IExclusionPreference>(Collection.exclusionPreferences, exclusionPreferencesSchema,Collection.exclusionPreferences);