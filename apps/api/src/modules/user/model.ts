import { model, Schema } from 'mongoose'

const userSchema = new Schema({
	seqNo: { type: String, unique: true, sparse: true },
	email: { type: String, required: true },
	passwordHash: { type: String },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	userType: { type: String, enum: ['Monthly_Local', 'Monthly_Foreigner', 'Daily_Foreigner', 'Contractor', 'Staff'] },
	roles: [{ type: String }],
	organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
	phone: { type: String },
	status: { type: String, enum: ['active', 'inactive', 'suspended', 'deleted'], default: 'active' },
	lastLoginAt: { type: Date },
	createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
	updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	deletedAt: { type: Date },
	deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: false })

userSchema.index({ email: 1 })
userSchema.index({ organizationId: 1 })
userSchema.index({ status: 1 })
userSchema.index({ deletedAt: 1 })

export const User = model('User', userSchema)
