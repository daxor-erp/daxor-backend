import mongoose, { Schema } from 'mongoose'
import { IBaseEntity } from '../base/mongo-repository'

export interface ILoanRepayment extends IBaseEntity {
  docNumber: string
  docDate: Date
  status: string
  organizationId: string
  createdBy: string
  isDeleted: boolean
  title?: string
  remarks?: string
  payPeriodStart?: Date
  payPeriodEnd?: Date
  employeeNo?: string
  employeeName?: string
  loanReference?: string
  repaymentAmount: number
}

const LoanRepaymentSchema = new Schema<ILoanRepayment>({
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
  employeeNo: { type: String },
  employeeName: { type: String },
  loanReference: { type: String },
  repaymentAmount: { type: Number, default: 0 },
}, { timestamps: true })

export const LoanRepayment = mongoose.model<ILoanRepayment>('LoanRepayment', LoanRepaymentSchema)
