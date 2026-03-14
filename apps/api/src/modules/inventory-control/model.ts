import mongoose, { Schema } from 'mongoose';
import { IBaseEntity } from '../base/mongo-repository';

export interface IInventoryControl extends IBaseEntity {
  itemId: string;
  itemName: string;
  binLocation: string;
  quantity: number;
  unit: string;
  minStockLevel: number;
  maxStockLevel: number;
  reorderPoint: number;
  warehouseId: string;
  lastStockDate: Date;
  stockStatus: string;
  organizationId: string;
  isDeleted: boolean;
}

export interface IStockMovement extends IBaseEntity {
  itemId: string;
  movementType: string;
  fromLocation: string;
  toLocation: string;
  quantity: number;
  unit: string;
  referenceModule: string;
  referenceId: string;
  movementDate: Date;
  notes: string;
  organizationId: string;
  createdBy: string;
  isDeleted: boolean;
}

const InventoryControlSchema = new Schema<IInventoryControl>({
  itemId: { type: String, required: true, index: true },
  itemName: { type: String, required: true },
  binLocation: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  unit: { type: String, required: true },
  minStockLevel: { type: Number, default: 0 },
  maxStockLevel: { type: Number, default: 0 },
  reorderPoint: { type: Number, default: 0 },
  warehouseId: { type: String, required: true },
  lastStockDate: { type: Date, default: Date.now },
  stockStatus: { type: String, default: 'IN_STOCK' },
  organizationId: { type: String, required: true, index: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const StockMovementSchema = new Schema<IStockMovement>({
  itemId: { type: String, required: true, index: true },
  movementType: { type: String, required: true },
  fromLocation: { type: String, required: true },
  toLocation: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  referenceModule: { type: String, required: true },
  referenceId: { type: String, required: true },
  movementDate: { type: Date, default: Date.now },
  notes: String,
  organizationId: { type: String, required: true, index: true },
  createdBy: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

InventoryControlSchema.index({ itemId: 1, binLocation: 1, organizationId: 1 }, { unique: true });

export const InventoryControl = mongoose.model<IInventoryControl>('InventoryControl', InventoryControlSchema);
export const StockMovement = mongoose.model<IStockMovement>('StockMovement', StockMovementSchema);
