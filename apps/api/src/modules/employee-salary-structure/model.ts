import mongoose, { Schema } from 'mongoose';
import { IBaseEntity } from '../base/mongo-repository';

export interface IStructureComponent {
  payComponentId: string;
  amount: number;
}

export interface IStatutoryOverrides {
  pfOptIn: boolean;
  pfRate: number;             // employee % (default 12)
  pfWageCeiling?: number;     // override ₹15k cap; null = uncapped
  esiOptIn: boolean;
  tdsRegime: 'NEW' | 'OLD';
  oldRegimeDeductions?: number; // annual 80C/HRA/etc total under old regime
  tdsMonthlyOverride?: number;  // bypass engine, deduct this fixed amount
}

export interface IEmployeeSalaryStructure extends IBaseEntity {
  organizationId: string;
  employeeId: string;
  effectiveFrom: Date;
  effectiveTo?: Date;
  ctcAnnual: number;
  basicMonthly: number;
  components: IStructureComponent[];
  statutory: IStatutoryOverrides;
  status: string;
  createdBy: string;
  isDeleted: boolean;
}

const StructureComponentSchema = new Schema<IStructureComponent>({
  payComponentId: { type: String, required: true },
  amount: { type: Number, required: true, default: 0 },
}, { _id: false });

const EmployeeSalaryStructureSchema = new Schema<IEmployeeSalaryStructure>({
  organizationId: { type: String, required: true, index: true },
  employeeId: { type: String, required: true, index: true },
  effectiveFrom: { type: Date, required: true },
  effectiveTo: { type: Date },
  ctcAnnual: { type: Number, default: 0 },
  basicMonthly: { type: Number, default: 0 },
  components: { type: [StructureComponentSchema], default: [] },
  statutory: {
    pfOptIn: { type: Boolean, default: true },
    pfRate: { type: Number, default: 12 },
    pfWageCeiling: { type: Number, default: 15000 },
    esiOptIn: { type: Boolean, default: true },
    tdsRegime: { type: String, enum: ['NEW', 'OLD'], default: 'NEW' },
    oldRegimeDeductions: { type: Number, default: 0 },
    tdsMonthlyOverride: { type: Number, default: null },
  },
  status: { type: String, default: 'ACTIVE' },
  createdBy: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const EmployeeSalaryStructure = mongoose.model<IEmployeeSalaryStructure>(
  'EmployeeSalaryStructure',
  EmployeeSalaryStructureSchema,
);
