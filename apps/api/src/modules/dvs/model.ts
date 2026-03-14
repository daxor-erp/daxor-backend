import mongoose, { Schema } from 'mongoose';
import { IBaseEntity } from '../base/mongo-repository';

export interface IDVS extends IBaseEntity {
  applicantId: string;
  documentType: string;
  documentName: string;
  documentNumber?: string;
  issuingAuthority?: string;
  issueDate?: Date;
  expiryDate?: Date;
  verificationStatus: string;
  verifiedBy?: string;
  verificationDate?: Date;
  verificationNotes?: string;
  documentUrl?: string;
  organizationId: string;
  isDeleted: boolean;
}

const DVSSchema = new Schema<IDVS>({
  applicantId: { type: String, required: true, index: true },
  documentType: { type: String, required: true },
  documentName: { type: String, required: true },
  documentNumber: String,
  issuingAuthority: String,
  issueDate: Date,
  expiryDate: Date,
  verificationStatus: { type: String, default: 'PENDING' },
  verifiedBy: String,
  verificationDate: Date,
  verificationNotes: String,
  documentUrl: String,
  organizationId: { type: String, required: true, index: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const DVS = mongoose.model<IDVS>('DVS', DVSSchema);
