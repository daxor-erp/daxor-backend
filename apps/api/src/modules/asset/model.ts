import mongoose, { Schema } from 'mongoose';
import { IBaseEntity } from '../base/mongo-repository';

export interface IAsset extends IBaseEntity {
  assetNumber: string;
  assetName: string;
  assetType: string;
  category: string;
  purchaseDate: Date;
  purchasePrice: number;
  currentValue: number;
  depreciationMethod: string;
  usefulLife: number;
  location: string;
  assignedTo?: string;
  status: string;
  serialNumber?: string;
  manufacturer?: string;
  warrantyExpiry?: Date;
  organizationId: string;
  isDeleted: boolean;
}

const AssetSchema = new Schema<IAsset>({
  assetNumber: { type: String, required: true, unique: true },
  assetName: { type: String, required: true },
  assetType: { type: String, required: true },
  category: { type: String, required: true },
  purchaseDate: { type: Date, required: true },
  purchasePrice: { type: Number, required: true },
  currentValue: { type: Number, required: true },
  depreciationMethod: { type: String, required: true },
  usefulLife: { type: Number, required: true },
  location: { type: String, required: true },
  assignedTo: String,
  status: { type: String, default: 'ACTIVE' },
  serialNumber: String,
  manufacturer: String,
  warrantyExpiry: Date,
  organizationId: { type: String, required: true, index: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const Asset = mongoose.model<IAsset>('Asset', AssetSchema);
