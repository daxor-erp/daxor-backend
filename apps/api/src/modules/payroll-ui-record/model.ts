import mongoose, { Schema } from 'mongoose'
import { IBaseEntity } from '../base/mongo-repository'

export interface IPayrollUiRecord extends IBaseEntity {
  organizationId: string
  category: string
  code?: string | null
  data: Record<string, unknown>
  createdBy: string
  isDeleted: boolean
}

const PayrollUiRecordSchema = new Schema<IPayrollUiRecord>(
  {
    organizationId: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    code: { type: String },
    data: { type: Schema.Types.Mixed, required: true },
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
