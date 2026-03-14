import mongoose, { Schema } from 'mongoose';
import { IBaseEntity } from '../base/mongo-repository';

export interface IGeneralLedger extends IBaseEntity {
  transactionNumber: string;
  transactionDate: Date;
  transactionType: string;
  referenceModule: string;
  referenceId: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  currency: string;
  description: string;
  fiscalYear: string;
  fiscalPeriod: string;
  status: string;
  organizationId: string;
  createdBy: string;
  isDeleted: boolean;
}

export interface IChartOfAccounts extends IBaseEntity {
  accountCode: string;
  accountName: string;
  accountType: string;
  parentAccount?: string;
  level: number;
  isActive: boolean;
  organizationId: string;
  isDeleted: boolean;
}

const GeneralLedgerSchema = new Schema<IGeneralLedger>({
  transactionNumber: { type: String, required: true, unique: true },
  transactionDate: { type: Date, required: true },
  transactionType: { type: String, required: true },
  referenceModule: { type: String, required: true },
  referenceId: { type: String, required: true },
  debitAccount: { type: String, required: true },
  creditAccount: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  description: { type: String, required: true },
  fiscalYear: { type: String, required: true },
  fiscalPeriod: { type: String, required: true },
  status: { type: String, default: 'POSTED' },
  organizationId: { type: String, required: true, index: true },
  createdBy: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const ChartOfAccountsSchema = new Schema<IChartOfAccounts>({
  accountCode: { type: String, required: true, unique: true },
  accountName: { type: String, required: true },
  accountType: { type: String, required: true },
  parentAccount: String,
  level: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
  organizationId: { type: String, required: true, index: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const GeneralLedger = mongoose.model<IGeneralLedger>('GeneralLedger', GeneralLedgerSchema);
export const ChartOfAccounts = mongoose.model<IChartOfAccounts>('ChartOfAccounts', ChartOfAccountsSchema);
