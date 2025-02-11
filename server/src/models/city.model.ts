// src/models/city.model.ts
import { Schema, model, Document } from 'mongoose';
import { Collection } from '../config/constants';

export interface ICity extends Document {
   name: string;
   stateId: string;
}

const citySchema = new Schema({
   name: {
       type: String,
       required: true,
       trim: true
   },
   stateId: {
       type: String,
       required: true
   }
}, {
   timestamps: false,
   versionKey: false
});

// Index for better query performance
citySchema.index({ stateId: 1 });
citySchema.index({ name: 1 });

export const City = model<ICity>(Collection.cityTableName, citySchema, Collection.cityTableName);