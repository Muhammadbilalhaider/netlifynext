// src/models/job.model.ts
import { Schema, model, Document } from 'mongoose';
import { Collection } from '../config/constants';

export interface IJob extends Document {
    title: string;
    description: string;
    companyName: string;
    location: string;
    applyUrl: string;
    publishedAt: number;
    postedDate: number;
    isDeleted: boolean;
    // Optional fields for rapid data
    site?: string;
    jobUrl?: string;
    jobUrlDirect?: string;
    jobType?: string;
    salarySource?: string;
    interval?: string;
    minAmount?: number;
    maxAmount?: number;
    currency?: string;
    isRemote?: boolean;
    jobLevel?: string;
    jobFunction?: string;
    companyIndustry?: string;
    listingType?: string;
    emails?: string[];
    companyUrl?: string;
    companyUrlDirect?: string;
    companyAddresses?: string[];
    companyNumEmployees?: string;
    companyRevenue?: string;
    companyDescription?: string;
    logoPhotoUrl?: string;
    bannerPhotoUrl?: string;
    ceoName?: string;
    ceoPhotoUrl?: string;
    createdAt: number;
    updatedAt: number;
    
}

const jobSchema = new Schema({
    // Required fields
    title: {
        type: String,
        // required: true,
        trim: true
    },
    description: {
        type: String,
        // required: true,
        trim: true
    },
    companyName: {
        type: String,
        // required: true,
        trim: true
    },
    location: {
        type: String,
        // required: true,
        trim: true
    },
    applyUrl: {
        type: String,
        required: true,
        // trim: true
    },
    publishedAt: {
        type: Number,
        // required: true
    },
    postedDate: {
        type: Number,
        // required: true
    },
    // Optional fields
    site: {
        type: String,
        trim: true
    },
    jobUrl: {
        type: String,
        trim: true
    },
    jobUrlDirect: {
        type: String,
        trim: true
    },
    jobType: {
        type: String,
        trim: true
    },
    salarySource: {
        type: String,
        trim: true
    },
    interval: {
        type: String,
        trim: true
    },
    minAmount: {
        type: Number
    },
    maxAmount: {
        type: Number
    },
    currency: {
        type: String,
        trim: true
    },
    isRemote: {
        type: Boolean
    },
    salary:{
        type:"string"
    },
    jobLevel: {
        type: String,
        trim: true
    },
    jobFunction: {
        type: String,
        trim: true
    },
    companyIndustry: {
        type: String,
        trim: true
    },
    listingType: {
        type: String,
        trim: true
    },
    emails: [{
        type: String,
        trim: true
    }],
    companyUrl: {
        type: String,
        trim: true
    },
    companyUrlDirect: {
        type: String,
        trim: true
    },
    companyAddresses: [{
        type: String,
        trim: true
    }],
    companyNumEmployees: {
        type: String,
        trim: true
    },
    companyRevenue: {
        type: String,
        trim: true
    },
    companyDescription: {
        type: String,
        trim: true
    },
    logoPhotoUrl: {
        type: String,
        trim: true
    },
    bannerPhotoUrl: {
        type: String,
        trim: true
    },
    ceoName: {
        type: String,
        trim: true
    },
    ceoPhotoUrl: {
        type: String,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: { type: Number, default: () => Math.floor(Date.now() / 1000) }, 
    updatedAt: { type: Number, default: () => Math.floor(Date.now() / 1000) }, // Unix timestamp in seconds
}, {
    // timestamps: {
    //     currentTime: () => Date.now()
    // },
    versionKey: false
});

// Middleware to update `updatedAt` on document updates
jobSchema.pre('save', function (next) {
    this.updatedAt = Math.floor(Date.now() / 1000); // Update the timestamp in Unix seconds
    next();
});

// Indexes
jobSchema.index({ companyName: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ postedDate: 1 });
jobSchema.index({ publishedAt: 1 });
jobSchema.index({ jobType: 1 });
jobSchema.index({ isRemote: 1 });
jobSchema.index({ title: 'text', description: 'text' });

export const Job = model<IJob>(Collection.jobsTableName, jobSchema, Collection.jobsTableName);