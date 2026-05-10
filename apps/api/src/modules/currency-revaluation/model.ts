import mongoose, { Schema } from 'mongoose';
import { IBaseEntity } from '../base/mongo-repository';

export interface ICurrencyRevaluationLine {
  accountCode: string;
  accountName: string;
  currency: string;
  originalAmount: number;
  revaluedAmount: number;
  gainLoss: number;
}

export interface ICurrencyRevaluation extends IBaseEntity {
  seqNo: string;
  revaluationDate: Date;
  baseCurrency: string;
  exchangeRates: Record<string, number>;
  lines: ICurrencyRevaluationLine[];
  totalGainLoss: number;
  status: string;
  postedAt?: Date;
  organizationId: string;
  createdBy: string;
  isDeleted: boolean;
}

const CurrencyRevaluationLineSchema = new Schema<ICurrencyRevaluationLine>({
  accountCode: { type: String, required: true },
  accountName: { type: String, required: true },
  currency: { type: String, required: true },
  originalAmount: { type: Number, required: true },
  revaluedAmount: { type: Number, required: true },
  gainLoss: { type: Number, required: true },
}, { _id: false });

const CurrencyRevaluationSchema = new Schema<ICurrencyRevaluation>({
  seqNo: { type: String, unique: true, sparse: true },
  revaluationDate: { type: Date, required: true },
  baseCurrency: { type: String, required: true },
  exchangeRates: { type: Map, of: Number, required: true },
  lines: [CurrencyRevaluationLineSchema],
  totalGainLoss: { type: Number, required: true },
  status: { type: String, default: 'draft', enum: ['draft', 'posted'] },
  postedAt: { type: Date },
  organizationId: { type: String, required: true, index: true },
  createdBy: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

CurrencyRevaluationSchema.index({ revaluationDate: 1 });

export const CurrencyRevaluation = mongoose.model<ICurrencyRevaluation>('CurrencyRevaluation', CurrencyRevaluationSchema);
