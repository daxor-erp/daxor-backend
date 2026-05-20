import mongoose, { Schema } from 'mongoose';
import { IBaseEntity } from '../base/mongo-repository';

export interface IOnboardingTask {
  title: string;
  done: boolean;
  doneAt?: Date;
  notes?: string;
}

export interface IOnboarding extends IBaseEntity {
  organizationId: string;
  employeeId: string;
  startedAt: Date;
  expectedCompletionDate?: Date;
  completedAt?: Date;
  tasks: IOnboardingTask[];
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdBy: string;
  isDeleted: boolean;
}

const OnboardingTaskSchema = new Schema<IOnboardingTask>({
  title: { type: String, required: true },
  done: { type: Boolean, default: false },
  doneAt: { type: Date },
  notes: { type: String },
}, { _id: false });

const OnboardingSchema = new Schema<IOnboarding>({
  organizationId: { type: String, required: true, index: true },
  employeeId: { type: String, required: true, index: true },
  startedAt: { type: Date, required: true, default: Date.now },
  expectedCompletionDate: { type: Date },
  completedAt: { type: Date },
  tasks: { type: [OnboardingTaskSchema], default: () => DEFAULT_TASKS() },
  status: {
    type: String,
    enum: ['IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'IN_PROGRESS',
  },
  createdBy: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

function DEFAULT_TASKS(): IOnboardingTask[] {
  return [
    { title: 'Collect offer letter acceptance', done: false },
    { title: 'Verify PAN, Aadhaar, UAN', done: false },
    { title: 'Bank account details captured', done: false },
    { title: 'Email & system access provisioned', done: false },
    { title: 'Asset issuance (laptop, ID card)', done: false },
    { title: 'Statutory forms signed (Form 11, F&F)', done: false },
    { title: 'Orientation session attended', done: false },
    { title: 'Reporting manager intro', done: false },
    { title: 'Probation review scheduled', done: false },
  ];
}

export const Onboarding = mongoose.model<IOnboarding>('Onboarding', OnboardingSchema);
