// src/models/job-action.model.ts
import { Schema, model, Document, Types } from 'mongoose';
import { Collection } from '../config/constants';

// Enum for JobAction status
export enum JobActionStatus {
  APPLIED = 1,
  FOLLOWED = 2,
  DO_NOT_APPLY = 3,
  DAILY = 4
}

export interface IJobAction extends Document {
  userId: Types.ObjectId;
  jobId: Types.ObjectId;
  applicationStatus: string;
  appliedOn: Date;
  notes: string;
  status: JobActionStatus;
  isDeleted: boolean;
}

const jobActionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: Collection.userTableName,
    required: true
  },
  jobId: {
    type: Schema.Types.ObjectId,
    ref: Collection.jobsTableName,
    required: true
  },
  applicationStatus: {
    type: String,
    trim: true,
  },
  appliedOn: {
    type: Date,
  },
  notes: {
    type: String,
    trim: true,
  },
  status: {
    type: Number,
    enum: Object.values(JobActionStatus),
    default: JobActionStatus.DAILY
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

// Indexes
jobActionSchema.index({ userId: 1, jobId: 1 }, { unique: true });
jobActionSchema.index({ userId: 1 });
jobActionSchema.index({ jobId: 1 });
jobActionSchema.index({ appliedOn: 1 });
jobActionSchema.index({ status: 1 });

export const JobAction = model<IJobAction>(Collection.jobActionTableName, jobActionSchema,Collection.jobActionTableName);