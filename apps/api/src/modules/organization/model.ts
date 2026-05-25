import { model, Schema } from 'mongoose'

const organizationSchema = new Schema({
	seqNo: { type: String, unique: true, sparse: true },
	code: { type: String, required: true },
	name: { type: String, required: true },
	type: { type: String, enum: ['client', 'vendor', 'both'] },
	contactPerson: { type: String },
	email: { type: String },
	phone: { type: String },
	address: { type: String },
	/** Parent tenant if this is a sub-tenant; null/undefined for root tenants. */
	parentOrganizationId: { type: Schema.Types.ObjectId, ref: 'Organization', default: null, index: true },
	/** When true, this org's ORG_ADMIN users may provision sub-tenants beneath them. */
	allowSubTenants: { type: Boolean, default: false },
	status: { type: String, enum: ['active', 'inactive', 'suspended', 'deleted'], default: 'active' },
	/** ERP module → user who may approve workflow requests for that module (within this org). */
	moduleApprovers: {
		type: [
			{
				moduleKey: { type: String, required: true },
				approverUserId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
				approverUserIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
			},
		],
		default: [],
	},
	createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	deletedAt: { type: Date },
}, { timestamps: false })

organizationSchema.index({ code: 1 })
organizationSchema.index({ status: 1 })
organizationSchema.index({ deletedAt: 1 })

export const Organization = model('Organization', organizationSchema)
