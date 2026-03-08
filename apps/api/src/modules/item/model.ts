import { model, Schema } from 'mongoose'

const itemSchema = new Schema({
	seqNo: { type: String, unique: true, sparse: true },
	name: { type: String, required: true },
	description: { type: String },
	category: { type: String },
	unit: { type: String },
	rate: { type: Number },
	organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
	status: { type: String, enum: ['active', 'inactive', 'deleted'], default: 'active' },
	createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	deletedAt: { type: Date },
}, { timestamps: false })

itemSchema.index({ name: 1 })
itemSchema.index({ organizationId: 1 })
itemSchema.index({ deletedAt: 1 })

export const Item = model('Item', itemSchema)
