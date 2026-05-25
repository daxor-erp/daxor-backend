import { model, Schema } from 'mongoose'

const userSchema = new Schema({
	seqNo: { type: String, unique: true, sparse: true },
	email: { type: String, required: true },
	passwordHash: { type: String },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	userType: { type: String, enum: ['Monthly_Local', 'Monthly_Foreigner', 'Daily_Foreigner', 'Contractor', 'Staff', 'employee'] },
	roles: [{ type: String }],
	organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
	phone: { type: String },
	currency: { type: String, enum: ['INR', 'USD', 'SGD', 'MYR'], default: 'INR' },
	status: { type: String, enum: ['active', 'inactive', 'suspended', 'deleted'], default: 'active' },
	lastLoginAt: { type: Date },
	createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
	updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	deletedAt: { type: Date },
	deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
	modulePermissions: [
		{
			moduleKey: { type: String, required: true },
			submoduleKey: { type: String },
			canCreate: { type: Boolean, default: false },
			canUpdate: { type: Boolean, default: false },
			canDelete: { type: Boolean, default: false },
			canView: { type: Boolean, default: false },
		},
	],
	dashboardPreferences: {
		erp: {
			hiddenWidgets: [{ type: String }],
			widgetOrder: [{ type: String }],
		},
		admin: {
			hiddenWidgets: [{ type: String }],
			widgetOrder: [{ type: String }],
		},
		orgAdmin: {
			hiddenWidgets: [{ type: String }],
			widgetOrder: [{ type: String }],
		},
	},
}, { timestamps: false })

userSchema.index({ email: 1 })
userSchema.index({ organizationId: 1 })
userSchema.index({ status: 1 })
userSchema.index({ deletedAt: 1 })

export const User = model('User', userSchema)
