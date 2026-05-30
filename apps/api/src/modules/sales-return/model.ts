import mongoose, { Schema } from 'mongoose';
import { IBaseEntity } from '../base/mongo-repository';

export interface ISalesReturn extends IBaseEntity {
  docNumber: string;
  docDate: Date;
  status: string;
  organizationId: string;
  createdBy: string;
  isDeleted: boolean;
  customerInvoiceId?: string;
  customerId?: string;
  totalAmount?: number;
  cogsAmount?: number;
  reason?: string;
}

const SalesReturnSchema = new Schema<ISalesReturn>({
  docNumber: { type: String, required: true, unique: true },
  docDate: { type: Date, required: true },
  status: { type: String, default: 'DRAFT' },
  organizationId: { type: String, required: true, index: true },
  createdBy: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  customerInvoiceId: { type: String },
  customerId: { type: String },
  totalAmount: { type: Number, default: 0 },
  cogsAmount: { type: Number, default: 0 },
  reason: { type: String },
}, { timestamps: true });

export const SalesReturn = mongoose.model<ISalesReturn>('SalesReturn', SalesReturnSchema);
