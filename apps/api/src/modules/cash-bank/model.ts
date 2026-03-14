import mongoose, { Schema } from 'mongoose';
import { IBaseEntity } from '../base/mongo-repository';

export interface ICashBank extends IBaseEntity {
  transactionNumber: string;
  transactionDate: Date;
  transactionType: string;
  bankAccount: string;
  referenceModule: string;
  referenceId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  chequeNumber?: string;
  description: string;
  reconciliationStatus: string;
  reconciliationDate?: Date;
  organizationId: string;
  createdBy: string;
  isDeleted: boolean;
}

export interface IBankAccount extends IBaseEntity {
  accountNumber: string;
  accountName: string;
  bankName: string;
  branchName: string;
  accountType: string;
  currency: string;
  currentBalance: number;
  isActive: boolean;
  organizationId: string;
  isDeleted: boolean;
}

const CashBankSchema = new Schema<ICashBank>({
  transactionNumber: { type: String, required: true, unique: true },
  transactionDate: { type: Date, required: true },
  transactionType: { type: String, required: true },
  bankAccount: { type: String, required: true },
  referenceModule: { type: String, required: true },
  referenceId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  paymentMethod: { type: String, required: true },
  chequeNumber: String,
  description: { type: String, required: true },
  reconciliationStatus: { type: String, default: 'PENDING' },
  reconciliationDate: Date,
  organizationId: { type: String, required: true, index: true },
  createdBy: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const BankAccountSchema = new Schema<IBankAccount>({
  accountNumber: { type: String, required: true, unique: true },
  accountName: { type: String, required: true },
  bankName: { type: String, required: true },
  branchName: { type: String, required: true },
  accountType: { type: String, required: true },
  currency: { type: String, default: 'USD' },
  currentBalance: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  organizationId: { type: String, required: true, index: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const CashBank = mongoose.model<ICashBank>('CashBank', CashBankSchema);
export const BankAccount = mongoose.model<IBankAccount>('BankAccount', BankAccountSchema);
