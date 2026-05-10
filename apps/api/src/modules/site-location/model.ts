import mongoose, { Schema } from 'mongoose';
import { IBaseEntity } from '../base/mongo-repository';

export interface ISiteLocation extends IBaseEntity {
  seqNo: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  status: string;
  organizationId: string;
  createdBy: string;
  isDeleted: boolean;
}

const SiteLocationSchema = new Schema<ISiteLocation>({
  seqNo: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  zipCode: { type: String },
  contactPerson: { type: String },
  phone: { type: String },
  email: { type: String },
  status: { type: String, default: 'active' },
  organizationId: { type: String, required: true, index: true },
  createdBy: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

SiteLocationSchema.index({ name: 1, organizationId: 1 });

export const SiteLocation = mongoose.model<ISiteLocation>('SiteLocation', SiteLocationSchema);
