// src/models/technology.model.ts
import { Schema, model, Document } from 'mongoose';
import { Collection } from '../config/constants';

export interface ITechnology extends Document {
   name: string;
   createdAt: number;
   updatedAt: number;
   isDeleted: boolean;
}

const technologySchema = new Schema({
   name: {
       type: String,
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

// Index for better query performance
technologySchema.index({ name: 1 });

export const Technology = model<ITechnology>(Collection.technologiesTableName, technologySchema, Collection.technologiesTableName);