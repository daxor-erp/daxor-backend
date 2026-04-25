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
  /** Legal / display name of the account holder (person or entity on the account) */
  accountHolder?: string;
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
  accountHolder: { type: String },
  bankName: { type: String, required: true },
  branchName: { type: String, required: true },
  accountType: { type: String, required: true },
  currency: { type: String, default: 'USD' },
  currentBalance: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  organizationId: { type: String, required: true, index: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

/** Single line as shown on a bank-issued statement (deposits = credit, withdrawals = debit). */
export interface IBankStatementLine extends IBaseEntity {
  organizationId: string;
  /** Bank account number (same as CashBank.bankAccount) */
  bankAccount: string;
  lineDate: Date;
  amount: number;
  lineKind: 'credit' | 'debit';
  description: string;
  bankReference: string;
  isMatched: boolean;
  matchedCashBankId?: string;
  isDeleted: boolean;
}

const BankStatementLineSchema = new Schema<IBankStatementLine>({
  organizationId: { type: String, required: true, index: true },
  bankAccount: { type: String, required: true, index: true },
  lineDate: { type: Date, required: true },
  amount: { type: Number, required: true, min: 0 },
  lineKind: { type: String, required: true, enum: ['credit', 'debit'] },
  description: { type: String, required: true },
  bankReference: { type: String, default: '' },
  isMatched: { type: Boolean, default: false, index: true },
  matchedCashBankId: { type: String },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

BankStatementLineSchema.index({ organizationId: 1, bankAccount: 1, isMatched: 1, lineDate: -1 });

/**
 * Heuristic for pairing a bank statement line to a book line (used for suggestions & future auto-match).
 * Both text fields are optional: if one is empty, that side is not filtered by text (amount/account still apply).
 */
export interface IReconciliationRule extends IBaseEntity {
  name: string;
  organizationId: string;
  /** Empty = applies to all bank accounts in the org */
  bankAccount: string;
  /** Lower value = higher priority when ordering suggestions */
  priority: number;
  isActive: boolean;
  /** Case-insensitive contains match on the bank statement line description */
  bankLineTextContains: string;
  /** Case-insensitive contains match on the book (register) line description */
  bookLineTextContains: string;
  amountTolerance: number;
  notes: string;
  isDeleted: boolean;
}

const ReconciliationRuleSchema = new Schema<IReconciliationRule>({
  name: { type: String, required: true },
  organizationId: { type: String, required: true, index: true },
  bankAccount: { type: String, default: '' },
  priority: { type: Number, default: 100 },
  isActive: { type: Boolean, default: true, index: true },
  bankLineTextContains: { type: String, default: '' },
  bookLineTextContains: { type: String, default: '' },
  amountTolerance: { type: Number, default: 0.01 },
  notes: { type: String, default: '' },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

ReconciliationRuleSchema.index({ organizationId: 1, priority: 1, isActive: 1 });

export const CashBank = mongoose.model<ICashBank>('CashBook', CashBankSchema);
export const BankAccount = mongoose.model<IBankAccount>('BankAccount', BankAccountSchema);
export const BankStatementLine = mongoose.model<IBankStatementLine>('BankStatementLine', BankStatementLineSchema);
export const ReconciliationRule = mongoose.model<IReconciliationRule>(
  'ReconciliationRule',
  ReconciliationRuleSchema,
);
