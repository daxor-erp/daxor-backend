import mongoose, { Schema } from 'mongoose'
import { IBaseEntity } from '../base/mongo-repository'

export interface IPayrollUiRecord extends IBaseEntity {
  organizationId: string
  category: string
  code?: string | null
  data: Record<string, unknown>
  createdBy: string
  isDeleted: boolean
  /** Org approver workflow; row `data` stays unchanged. */
  approvalStatus?: 'none' | 'pending' | 'approved' | 'declined'
}

const PayrollUiRecordSchema = new Schema<IPayrollUiRecord>(
  {
    organizationId: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    code: { type: String },
    data: { type: Schema.Types.Mixed, required: true },
    approvalStatus: {
      type: String,
      enum: ['none', 'pending', 'approved', 'declined'],
      default: 'none',
    },
    createdBy: { type: String, required: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
)

PayrollUiRecordSchema.index({ organizationId: 1, category: 1, isDeleted: 1 })

export const PayrollUiRecord = mongoose.model<IPayrollUiRecord>(
  'PayrollUiRecord',
  PayrollUiRecordSchema,
)
