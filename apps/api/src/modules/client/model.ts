import { model, Schema } from 'mongoose'

const clientSchema = new Schema({
	seqNo: { type: String, unique: true, sparse: true },
	name: { type: String, required: true },
	email: { type: String, required: true },
	phone: { type: String },
	company: { type: String },
	address: { type: String },
	city: { type: String },
	state: { type: String },
	country: { type: String },
	zipCode: { type: String },
	website: { type: String },
	industry: { type: String },
	notes: { type: String },
	status: { 
		type: String, 
		enum: ['active', 'inactive', 'prospect', 'lead'], 
		default: 'prospect' 
	},
	organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
	createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	deletedAt: { type: Date },
}, { timestamps: false })

clientSchema.index({ name: 1 })
clientSchema.index({ email: 1 })
clientSchema.index({ organizationId: 1 })
clientSchema.index({ status: 1 })
clientSchema.index({ deletedAt: 1 })

export const Client = model('Client', clientSchema)
