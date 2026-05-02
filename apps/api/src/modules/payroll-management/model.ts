import mongoose, { Schema } from 'mongoose';
import { IBaseEntity } from '../base/mongo-repository';

export interface IPayrollManagement extends IBaseEntity {
  docNumber: string;
  docDate: Date;
  status: string;
  organizationId: string;
  createdBy: string;
  isDeleted: boolean;
  /** Short label, e.g. "April 2026 — Operations" */
  title?: string;
  remarks?: string;
  payPeriodStart?: Date;
  payPeriodEnd?: Date;
}

const PayrollManagementSchema = new Schema<IPayrollManagement>({
  docNumber: { type: String, required: true, unique: true },
  docDate: { type: Date, required: true },
  status: { type: String, default: 'DRAFT' },
  organizationId: { type: String, required: true, index: true },
  createdBy: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  title: { type: String },
  remarks: { type: String },
  payPeriodStart: { type: Date },
  payPeriodEnd: { type: Date },
}, { timestamps: true });

export const PayrollManagement = mongoose.model<IPayrollManagement>('PayrollManagement', PayrollManagementSchema);
