import mongoose, { Schema } from 'mongoose';
import { IBaseEntity } from '../base/mongo-repository';

const lineItemSchema = new Schema(
  {
    itemId: { type: String },
    itemDescription: { type: String, required: true },
    orderedQty: { type: Number, default: 0 },
    receivedQty: { type: Number, required: true },
    unit: { type: String },
    unitPrice: { type: Number, default: 0 },
  },
  { _id: false },
);

export interface IGoodsReceiptLineItem {
  itemId?: string;
  itemDescription: string;
  orderedQty?: number;
  receivedQty: number;
  unit?: string;
  unitPrice?: number;
}

export interface IGoodsReceipt extends IBaseEntity {
  docNumber: string;
  docDate: Date;
  status: string;
  organizationId: string;
  purchaseOrderId?: string;
  purchaseOrderNumber?: string;
  vendorId?: string;
  vendorName?: string;
  warehouseId?: string;
  warehouseName?: string;
  lineItems: IGoodsReceiptLineItem[];
  notes?: string;
  createdBy: string;
  isDeleted: boolean;
}

const GoodsReceiptSchema = new Schema<IGoodsReceipt>(
  {
    docNumber: { type: String, required: true, unique: true },
    docDate: { type: Date, required: true },
    status: { type: String, default: 'DRAFT' },
    organizationId: { type: String, required: true, index: true },
    purchaseOrderId: { type: String },
    purchaseOrderNumber: { type: String },
    vendorId: { type: String },
    vendorName: { type: String },
    warehouseId: { type: String },
    warehouseName: { type: String },
    lineItems: { type: [lineItemSchema], default: [] },
    notes: { type: String },
    createdBy: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const GoodsReceipt = mongoose.model<IGoodsReceipt>('GoodsReceipt', GoodsReceiptSchema);
