import mongoose, { Schema } from 'mongoose';
import { IBaseEntity } from '../base/mongo-repository';

export interface IBudgetLine {
  accountCode: string;
  accountName: string;
  period: string;
  amount: number;
}

export interface IBudget extends IBaseEntity {
  seqNo: string;
  budgetName: string;
  fiscalYear: string;
  startDate: Date;
  endDate: Date;
  lines: IBudgetLine[];
  totalAmount: number;
  status: string;
  organizationId: string;
  createdBy: string;
  isDeleted: boolean;
}

const BudgetLineSchema = new Schema<IBudgetLine>({
  accountCode: { type: String, required: true },
  accountName: { type: String, required: true },
  period: { type: String, required: true },
  amount: { type: Number, required: true },
}, { _id: false });

const BudgetSchema = new Schema<IBudget>({
  seqNo: { type: String, unique: true, sparse: true },
  budgetName: { type: String, required: true },
  fiscalYear: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  lines: [BudgetLineSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'draft', enum: ['draft', 'active', 'closed'] },
  organizationId: { type: String, required: true, index: true },
  createdBy: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

BudgetSchema.index({ fiscalYear: 1, organizationId: 1 });
BudgetSchema.index({ status: 1 });

export const Budget = mongoose.model<IBudget>('Budget', BudgetSchema);
