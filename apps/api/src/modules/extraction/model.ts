import mongoose, { Schema } from 'mongoose';
import { IBaseEntity } from '../base/mongo-repository';

export interface IExtraction extends IBaseEntity {
  extractionNumber: string;
  extractionDate: Date;
  rawMaterialId: string;
  rawMaterialName: string;
  quantity: number;
  unit: string;
  sourceLocation: string;
  extractionType: string;
  status: string;
  productionOrderId?: string;
  requisitionId?: string;
  organizationId: string;
  createdBy: string;
  isDeleted: boolean;
}

export interface IRawMaterialRequisition extends IBaseEntity {
  requisitionNumber: string;
  requisitionDate: Date;
  requiredDate: Date;
  rawMaterialId: string;
  requestedQuantity: number;
  unit: string;
  purpose: string;
  requestedBy: string;
  status: string;
  organizationId: string;
  isDeleted: boolean;
}

const ExtractionSchema = new Schema<IExtraction>({
  extractionNumber: { type: String, required: true, unique: true },
  extractionDate: { type: Date, required: true },
  rawMaterialId: { type: String, required: true },
  rawMaterialName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  sourceLocation: { type: String, required: true },
  extractionType: { type: String, required: true },
  status: { type: String, default: 'PLANNED' },
  productionOrderId: String,
  requisitionId: String,
  organizationId: { type: String, required: true, index: true },
  createdBy: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const RawMaterialRequisitionSchema = new Schema<IRawMaterialRequisition>({
  requisitionNumber: { type: String, required: true, unique: true },
  requisitionDate: { type: Date, required: true },
  requiredDate: { type: Date, required: true },
  rawMaterialId: { type: String, required: true },
  requestedQuantity: { type: Number, required: true },
  unit: { type: String, required: true },
  purpose: { type: String, required: true },
  requestedBy: { type: String, required: true },
  status: { type: String, default: 'DRAFT' },
  organizationId: { type: String, required: true, index: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const Extraction = mongoose.model<IExtraction>('Extraction', ExtractionSchema);
export const RawMaterialRequisition = mongoose.model<IRawMaterialRequisition>('RawMaterialRequisition', RawMaterialRequisitionSchema);
