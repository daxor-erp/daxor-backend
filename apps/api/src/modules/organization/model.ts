import { model, Schema } from 'mongoose'

const organizationSchema = new Schema({
	seqNo: { type: String, unique: true, sparse: true },
	code: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	type: { type: String, enum: ['client', 'vendor', 'both'] },
	contactPerson: { type: String },
	email: { type: String },
	phone: { type: String },
	address: { type: String },
	status: { type: String, enum: ['active', 'inactive', 'suspended', 'deleted'], default: 'active' },
	createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	deletedAt: { type: Date },
}, { timestamps: false })

organizationSchema.index({ code: 1 })
organizationSchema.index({ status: 1 })
organizationSchema.index({ deletedAt: 1 })

export const Organization = model('Organization', organizationSchema)
