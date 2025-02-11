// src/models/country.model.ts
import { Schema, model, Document } from 'mongoose';
import { Collection } from '../config/constants';

export interface ICountry extends Document {
   sortname: string;
   name: string;
   phoneCode: number;
}

const countrySchema = new Schema({
   sortname: {
       type: String,
       required: true,
       trim: true
   },
   name: {
       type: String,
       required: true,
       trim: true
   },
   phoneCode: {
       type: Number,
       required: true
   }
}, {
   timestamps: false,  // No timestamps needed
   versionKey: false
});

export const Country = model<ICountry>(Collection.countryTableName, countrySchema, Collection.countryTableName);