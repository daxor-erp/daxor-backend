import mongoose, { Schema } from 'mongoose'
import { IBaseEntity } from '../base/mongo-repository'

export interface IDeliveryChallanLine {
  itemName: string
  quantity: number
  unit?: string
  notes?: string
}

export interface IDeliveryChallan extends IBaseEntity {
  docNumber: string
  docDate: Date
  customerId?: string
  customerName?: string
  salesOrderId?: string
  salesOrderNumber?: string
  shippingAddress?: string
  vehicleNumber?: string
  driverName?: string
  notes?: string
  items: IDeliveryChallanLine[]
  status: string
  organizationId: string
  createdBy: string
  isDeleted: boolean
}

const DeliveryChallanLineSchema = new Schema<IDeliveryChallanLine>(
  {
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, default: 'unit' },
    notes: { type: String },
  },
  { _id: false },
)

const DeliveryChallanSchema = new Schema<IDeliveryChallan>(
  {
    docNumber: { type: String, required: true, unique: true },
    docDate: { type: Date, required: true },
    customerId: { type: String, index: true },
    customerName: { type: String },
    salesOrderId: { type: String, index: true },
    salesOrderNumber: { type: String },
    shippingAddress: { type: String },
    vehicleNumber: { type: String },
    driverName: { type: String },
    notes: { type: String },
    items: { type: [DeliveryChallanLineSchema], default: [] },
    status: { type: String, default: 'DRAFT' },
    organizationId: { type: String, required: true, index: true },
    createdBy: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export const DeliveryChallan = mongoose.model<IDeliveryChallan>('DeliveryChallan', DeliveryChallanSchema)
