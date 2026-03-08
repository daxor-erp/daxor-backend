import { model, Schema } from 'mongoose'

const projectSchema = new Schema({
	seqNo: { type: String, unique: true, sparse: true },
	name: { type: String, required: true },
	description: { type: String },
	startDate: { type: Date },
	endDate: { type: Date },
	organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
	status: { type: String, enum: ['active', 'inactive', 'completed', 'deleted'], default: 'active' },
	createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	deletedAt: { type: Date },
}, { timestamps: false })

projectSchema.index({ name: 1 })
projectSchema.index({ organizationId: 1 })
projectSchema.index({ deletedAt: 1 })

export const Project = model('Project', projectSchema)
