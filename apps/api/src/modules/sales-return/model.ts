import mongoose, { Schema } from 'mongoose';
import { IBaseEntity } from '../base/mongo-repository';

export interface ISalesReturn extends IBaseEntity {
  docNumber: string;
  docDate: Date;
  status: string;
  organizationId: string;
  createdBy: string;
  isDeleted: boolean;
}

const SalesReturnSchema = new Schema<ISalesReturn>({
  docNumber: { type: String, required: true, unique: true },
  docDate: { type: Date, required: true },
  status: { type: String, default: 'DRAFT' },
  organizationId: { type: String, required: true, index: true },
  createdBy: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const SalesReturn = mongoose.model<ISalesReturn>('SalesReturn', SalesReturnSchema);
