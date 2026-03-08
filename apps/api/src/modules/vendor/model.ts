import { model, Schema } from 'mongoose'

const vendorSchema = new Schema({
	seqNo: { type: String, unique: true, sparse: true },
	name: { type: String, required: true },
	contactPerson: { type: String },
	email: { type: String },
	phone: { type: String },
	address: { type: String },
	organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
	status: { type: String, enum: ['active', 'inactive', 'deleted'], default: 'active' },
	createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	deletedAt: { type: Date },
}, { timestamps: false })

vendorSchema.index({ name: 1 })
vendorSchema.index({ organizationId: 1 })
vendorSchema.index({ deletedAt: 1 })

export const Vendor = model('Vendor', vendorSchema)
