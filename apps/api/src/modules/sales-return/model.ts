import mongoose, { Schema } from 'mongoose'
import { IBaseEntity } from '../base/mongo-repository'

export interface ISalesReturnLine {
  itemName: string
  quantity: number
  unit?: string
  unitPrice?: number
  amount?: number
  notes?: string
}

export interface ISalesReturn extends IBaseEntity {
  docNumber: string
  docDate: Date
  status: string
  organizationId: string
  createdBy: string
  isDeleted: boolean
  customerInvoiceId?: string
  customerInvoiceNumber?: string
  customerId?: string
  customerName?: string
  salesOrderId?: string
  salesOrderNumber?: string
  totalAmount?: number
  cogsAmount?: number
  reason?: string
  notes?: string
  items?: ISalesReturnLine[]
}

const SalesReturnLineSchema = new Schema<ISalesReturnLine>(
  {
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, default: 'unit' },
    unitPrice: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    notes: { type: String },
  },
  { _id: false },
)

const SalesReturnSchema = new Schema<ISalesReturn>(
  {
    docNumber: { type: String, required: true, unique: true },
    docDate: { type: Date, required: true },
    status: { type: String, default: 'DRAFT' },
    organizationId: { type: String, required: true, index: true },
    createdBy: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    customerInvoiceId: { type: String },
    customerInvoiceNumber: { type: String },
    customerId: { type: String, index: true },
    customerName: { type: String },
    salesOrderId: { type: String },
    salesOrderNumber: { type: String },
    totalAmount: { type: Number, default: 0 },
    cogsAmount: { type: Number, default: 0 },
    reason: { type: String },
    notes: { type: String },
    items: { type: [SalesReturnLineSchema], default: [] },
  },
  { timestamps: true },
)

export const SalesReturn = mongoose.model<ISalesReturn>('SalesReturn', SalesReturnSchema)
