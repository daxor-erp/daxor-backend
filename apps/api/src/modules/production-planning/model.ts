import mongoose, { Schema } from 'mongoose';
import { IBaseEntity } from '../base/mongo-repository';

const taskSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'in-progress', 'completed', 'blocked'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  startDate: { type: Date },
  dueDate: { type: Date },
  completedAt: { type: Date },
}, { _id: true });

const milestoneSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  completedAt: { type: Date },
}, { _id: true });

export interface IProductionPlanning extends IBaseEntity {
  docNumber: string;
  docDate: Date;
  projectId?: string;
  managerId?: string;
  budget?: number;
  actualCost?: number;
  progress?: number;
  tasks?: any[];
  milestones?: any[];
  status: string;
  organizationId: string;
  createdBy: string;
  isDeleted: boolean;
}

const ProductionPlanningSchema = new Schema<IProductionPlanning>({
  docNumber: { type: String, required: true, unique: true },
  docDate: { type: Date, required: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
  managerId: { type: Schema.Types.ObjectId, ref: 'User' },
  budget: { type: Number },
  actualCost: { type: Number, default: 0 },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  tasks: [taskSchema],
  milestones: [milestoneSchema],
  status: { type: String, default: 'DRAFT' },
  organizationId: { type: String, required: true, index: true },
  createdBy: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

ProductionPlanningSchema.index({ projectId: 1 });
ProductionPlanningSchema.index({ managerId: 1 });

export const ProductionPlanning = mongoose.model<IProductionPlanning>('ProductionPlanning', ProductionPlanningSchema);
