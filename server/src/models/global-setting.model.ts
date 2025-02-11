// src/models/global-setting.model.ts
import { Schema, model, Document } from 'mongoose';
import { Collection } from '../config/constants';

export interface IGlobalSetting extends Document {
   settingId: string;
   excludedCompanies: string[];
   createAt: number;
   updatedAt: number;
   isDeleted: boolean;
}

const globalSettingSchema = new Schema({
   settingId: {
       type: String,
       required: true,
       unique: true
   },
   excludedCompanies: [{
       type: String,
       trim: true
   }],
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
// globalSettingSchema.index({ settingId: 1 });
// globalSettingSchema.index({ excludedCompanies: 1 });

export const GlobalSetting = model<IGlobalSetting>(Collection.globalSettingsTable, globalSettingSchema, Collection.globalSettingsTable);