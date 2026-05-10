import mongoose, { Schema } from 'mongoose';
import { IBaseEntity } from '../base/mongo-repository';

export interface IAllocationLine {
  destinationAccount: string;
  percentage: number;
  amount?: number;
}

export interface IAllocationSchedule extends IBaseEntity {
  seqNo: string;
  scheduleName: string;
  sourceAccount: string;
  allocationMethod: string;
  lines: IAllocationLine[];
  isActive: boolean;
  organizationId: string;
  createdBy: string;
  isDeleted: boolean;
}

const AllocationLineSchema = new Schema<IAllocationLine>({
  destinationAccount: { type: String, required: true },
  percentage: { type: Number, required: true },
  amount: { type: Number },
}, { _id: false });

const AllocationScheduleSchema = new Schema<IAllocationSchedule>({
  seqNo: { type: String, unique: true, sparse: true },
  scheduleName: { type: String, required: true },
  sourceAccount: { type: String, required: true },
  allocationMethod: { type: String, default: 'percentage', enum: ['percentage', 'amount'] },
  lines: [AllocationLineSchema],
  isActive: { type: Boolean, default: true },
  organizationId: { type: String, required: true, index: true },
  createdBy: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

AllocationScheduleSchema.index({ scheduleName: 1, organizationId: 1 });

export const AllocationSchedule = mongoose.model<IAllocationSchedule>('AllocationSchedule', AllocationScheduleSchema);
