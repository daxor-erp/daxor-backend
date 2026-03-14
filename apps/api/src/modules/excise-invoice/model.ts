import mongoose, { Schema } from 'mongoose';
import { IBaseEntity } from '../base/mongo-repository';

export interface IExciseInvoice extends IBaseEntity {
  docNumber: string;
  docDate: Date;
  status: string;
  organizationId: string;
  createdBy: string;
  isDeleted: boolean;
}

const ExciseInvoiceSchema = new Schema<IExciseInvoice>({
  docNumber: { type: String, required: true, unique: true },
  docDate: { type: Date, required: true },
  status: { type: String, default: 'DRAFT' },
  organizationId: { type: String, required: true, index: true },
  createdBy: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const ExciseInvoice = mongoose.model<IExciseInvoice>('ExciseInvoice', ExciseInvoiceSchema);
