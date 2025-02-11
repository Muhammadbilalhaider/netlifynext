// src/models/configuration.model.ts
import { Schema, model, Document } from 'mongoose';
import { Collection } from '../config/constants';

export interface IConfiguration extends Document {
   type: string;
   keys: string[];
   name: string;
   createAt: number;
   updatedAt: number;
   isDeleted: boolean;
}

const configurationSchema = new Schema({
   type: {
       type: String,
       required: true
   },
   keys: [{
       type: String,
       trim: true
   }],
   name: {
       type: String,
       required: true,
       trim: true
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
configurationSchema.index({ type: 1 });
configurationSchema.index({ name: 1 });

export const Configuration = model<IConfiguration>(Collection.configurationsTable, configurationSchema, Collection.configurationsTable);