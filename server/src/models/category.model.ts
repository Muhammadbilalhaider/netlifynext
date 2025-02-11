// src/models/category.model.ts
import { Schema, model, Document } from 'mongoose';
import { Collection } from '../config/constants';

export interface ICategory extends Document {
   name: string;
   createAt: number;
   updatedAt: number;
   isDeleted: boolean;
}

const categorySchema = new Schema({
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

export const Category = model<ICategory>(Collection.categoryTable, categorySchema, Collection.categoryTable);