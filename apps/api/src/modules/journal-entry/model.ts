import mongoose, { Schema } from 'mongoose';
import { IBaseEntity } from '../base/mongo-repository';

export interface IJournalEntryLine {
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description?: string;
}

export interface IJournalEntry extends IBaseEntity {
  seqNo: string;
  entryNumber: string;
  entryDate: Date;
  referenceNumber?: string;
  description: string;
  lines: IJournalEntryLine[];
  totalDebit: number;
  totalCredit: number;
  status: string;
  postedAt?: Date;
  postedBy?: string;
  organizationId: string;
  createdBy: string;
  isDeleted: boolean;
}

const JournalEntryLineSchema = new Schema<IJournalEntryLine>({
  accountCode: { type: String, required: true },
  accountName: { type: String, required: true },
  debit: { type: Number, default: 0 },
  credit: { type: Number, default: 0 },
  description: { type: String },
}, { _id: false });

const JournalEntrySchema = new Schema<IJournalEntry>({
  seqNo: { type: String, unique: true, sparse: true },
  entryNumber: { type: String, required: true },
  entryDate: { type: Date, required: true },
  referenceNumber: { type: String },
  description: { type: String, required: true },
  lines: [JournalEntryLineSchema],
  totalDebit: { type: Number, required: true },
  totalCredit: { type: Number, required: true },
  status: { type: String, default: 'draft', enum: ['draft', 'posted', 'cancelled'] },
  postedAt: { type: Date },
  postedBy: { type: String },
  organizationId: { type: String, required: true, index: true },
  createdBy: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

JournalEntrySchema.index({ entryNumber: 1, organizationId: 1 }, { unique: true });
JournalEntrySchema.index({ status: 1 });
JournalEntrySchema.index({ entryDate: 1 });

export const JournalEntry = mongoose.model<IJournalEntry>('JournalEntry', JournalEntrySchema);
