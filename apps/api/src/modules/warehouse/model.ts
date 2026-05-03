import mongoose, { Schema } from 'mongoose';
import { IBaseEntity } from '../base/mongo-repository';

export interface IWarehouse extends IBaseEntity {
  warehouseCode: string;
  warehouseName: string;
  location: string;
  address: string;
  capacity: number;
  currentUtilization: number;
  managerName: string;
  contactNumber: string;
  warehouseType: string;
  isActive: boolean;
  organizationId: string;
  isDeleted: boolean;
}

export interface IWarehouseBin extends IBaseEntity {
  warehouseId: string;
  binCode: string;
  binLocation: string;
  binType: string;
  capacity: number;
  currentStock: number;
  isAvailable: boolean;
  organizationId: string;
  isDeleted: boolean;
}

const WarehouseSchema = new Schema<IWarehouse>({
  warehouseCode: { type: String, required: true },
  warehouseName: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  capacity: { type: Number, required: true },
  currentUtilization: { type: Number, default: 0 },
  managerName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  warehouseType: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  organizationId: { type: String, required: true, index: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

WarehouseSchema.index({ organizationId: 1, warehouseCode: 1 }, { unique: true });

const WarehouseBinSchema = new Schema<IWarehouseBin>({
  warehouseId: { type: String, required: true, index: true },
  binCode: { type: String, required: true, unique: true },
  binLocation: { type: String, required: true },
  binType: { type: String, required: true },
  capacity: { type: Number, required: true },
  currentStock: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  organizationId: { type: String, required: true, index: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const Warehouse = mongoose.model<IWarehouse>('Warehouse', WarehouseSchema);
export const WarehouseBin = mongoose.model<IWarehouseBin>('WarehouseBin', WarehouseBinSchema);
