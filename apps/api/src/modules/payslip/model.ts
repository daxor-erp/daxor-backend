import mongoose, { Schema } from 'mongoose';
import { IBaseEntity } from '../base/mongo-repository';

export interface IPayslipLine {
  code: string;
  name: string;
  type: 'EARNING' | 'DEDUCTION';
  amount: number;
}

export interface IPayslip extends IBaseEntity {
  organizationId: string;
  payrollRunId: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  payPeriodStart: Date;
  payPeriodEnd: Date;
  workingDays: number;
  paidDays: number;
  lopDays: number;
  earnings: IPayslipLine[];
  deductions: IPayslipLine[];
  grossEarnings: number;
  totalDeductions: number;
  pfEmployee: number;
  pfEmployer: number;
  esiEmployee: number;
  esiEmployer: number;
  tds: number;
  netPay: number;
  status: string;
  payoutId?: string;
  payoutStatus?: string;
  createdBy: string;
  isDeleted: boolean;
}

const PayslipLineSchema = new Schema<IPayslipLine>({
  code: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['EARNING', 'DEDUCTION'], required: true },
  amount: { type: Number, required: true, default: 0 },
}, { _id: false });

const PayslipSchema = new Schema<IPayslip>({
  organizationId: { type: String, required: true, index: true },
  payrollRunId: { type: String, required: true, index: true },
  employeeId: { type: String, required: true, index: true },
  employeeCode: { type: String, required: true },
  employeeName: { type: String, required: true },
  payPeriodStart: { type: Date, required: true },
  payPeriodEnd: { type: Date, required: true },
  workingDays: { type: Number, default: 0 },
  paidDays: { type: Number, default: 0 },
  lopDays: { type: Number, default: 0 },
  earnings: { type: [PayslipLineSchema], default: [] },
  deductions: { type: [PayslipLineSchema], default: [] },
  grossEarnings: { type: Number, default: 0 },
  totalDeductions: { type: Number, default: 0 },
  pfEmployee: { type: Number, default: 0 },
  pfEmployer: { type: Number, default: 0 },
  esiEmployee: { type: Number, default: 0 },
  esiEmployer: { type: Number, default: 0 },
  tds: { type: Number, default: 0 },
  netPay: { type: Number, default: 0 },
  status: { type: String, default: 'COMPUTED' },
  payoutId: { type: String },
  payoutStatus: { type: String },
  createdBy: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

PayslipSchema.index({ payrollRunId: 1, employeeId: 1 }, { unique: true });

export const Payslip = mongoose.model<IPayslip>('Payslip', PayslipSchema);
