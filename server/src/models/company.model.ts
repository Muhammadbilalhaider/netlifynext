// src/models/company.model.ts
import { Schema, model, Document, Types } from 'mongoose';
import { Collection } from '../config/constants';

interface ICompany extends Document {
    name: string;
    isScam: boolean;
    scamReason?: string;
    reportedBy?: Types.ObjectId;
    verifiedScam?: boolean;
    createAt: number;
    updatedAt: number;
    isDeleted: boolean;
}

const companySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    isScam: {
        type: Boolean,
        default: false
    },
    scamReason: {
        type: String,
        trim: true
    },
    reportedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    verifiedScam: {
        type: Boolean,
        default: false
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
// companySchema.index({ name: 1 });
companySchema.index({ isScam: 1 });
companySchema.index({ verifiedScam: 1 });

export const Company = model<ICompany>(Collection.companiesTableName, companySchema, Collection.companiesTableName);