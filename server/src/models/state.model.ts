// src/models/state.model.ts
import { Schema, model, Document } from 'mongoose';
import { Collection } from '../config/constants';

export interface IState extends Document {
   name: string;
   countryId: string;
}

const stateSchema = new Schema({
   name: {
       type: String,
       required: true,
       trim: true
   },
   countryId: {
       type: String,
       required: true
   }
}, {
   timestamps: false,
   versionKey: false
});

// Indexes for better query performance
stateSchema.index({ countryId: 1 });
stateSchema.index({ name: 1 });

export const State = model<IState>(Collection.stateTableName, stateSchema, Collection.stateTableName);