import { model, Schema } from 'mongoose'

const addressSchema = new Schema(
	{
		street: { type: String, default: '' },
		city: { type: String, default: '' },
		zip: { type: String, default: '' },
		country: { type: String, default: '' },
	},
	{ _id: false },
)

const vendorTagSchema = new Schema(
	{
		tagId: { type: Schema.Types.ObjectId, ref: 'Tag', required: true },
		name: { type: String, required: true },
		color: { type: String, default: '#94a3b8' },
		category: { type: String, default: '' },
	},
	{ _id: false },
)

const salesInfoSchema = new Schema(
	{
		salesperson: { type: Schema.Types.ObjectId, ref: 'User', default: null },
		paymentTerms: { type: Schema.Types.ObjectId, ref: 'PaymentTerm', default: null },
		paymentMethod: { type: String, default: '' },
		priceList: { type: Schema.Types.ObjectId, ref: 'PriceList', default: null },
		deliveryMethod: { type: String, default: '' },
	},
	{ _id: false },
)

const purchaseInfoSchema = new Schema(
	{
		buyer: { type: Schema.Types.ObjectId, ref: 'User', default: null },
		/** Kept as free master-data ref (PaymentTerm) rather than the legacy hardcoded enum. */
		paymentTerms: { type: Schema.Types.ObjectId, ref: 'PaymentTerm', default: null },
		/** Vendor bank account used for payment (links into vendor.bankAccounts[]). */
		paymentMethod: { type: Schema.Types.ObjectId, default: null },
		fiscalPosition: { type: String, default: '' },
	},
	{ _id: false },
)

const inventoryInfoSchema = new Schema(
	{
		customerLocation: { type: String, default: '' },
		vendorLocation: { type: String, default: '' },
		subcontractingLocation: { type: String, default: '' },
	},
	{ _id: false },
)

const miscInfoSchema = new Schema(
	{
		reference: { type: String, default: '' },
		companyId: { type: Schema.Types.ObjectId, ref: 'Organization', default: null },
		/** Free-text display name of the operating company, independent of the linked Organization record. */
		company: { type: String, default: '' },
		slaPolicies: { type: String, default: '' },
	},
	{ _id: false },
)

const vendorBankAccountSchema = new Schema(
	{
		accountNumber: { type: String, required: true },
		bankId: { type: Schema.Types.ObjectId, ref: 'Bank', default: null },
		bankName: { type: String, default: '' }, // denormalized for display
		currency: { type: String, default: 'INR' },
		accountHolder: { type: String, default: '' },
		sendMoney: { type: Boolean, default: false },
	},
	{ timestamps: true },
)

const accountingInfoSchema = new Schema(
	{
		accountReceivable: { type: String, default: '' },
		accountPayable: { type: String, default: '' },
		/** How invoices/bills should be sent to this vendor by default. */
		invoiceSendingPreference: {
			type: String,
			enum: ['email', 'postal', 'manual'],
			default: 'email',
		},
	},
	{ _id: false },
)

const warningsSchema = new Schema(
	{
		salesOrder: { type: String, enum: ['no_message', 'warning', 'blocking'], default: 'no_message' },
		purchaseOrder: { type: String, enum: ['no_message', 'warning', 'blocking'], default: 'no_message' },
		picking: { type: String, enum: ['no_message', 'warning', 'blocking'], default: 'no_message' },
	},
	{ _id: false },
)

const vendorSchema = new Schema(
	{
		seqNo: { type: String, unique: true, sparse: true },

		// Step 1 — vendor type & identity
		type: { type: String, enum: ['individual', 'company'], default: 'company' },
		name: { type: String, required: true },
		address: { type: addressSchema, default: () => ({}) },

		// Step 2 — tax details
		gstTreatment: {
			type: String,
			enum: [
				'registered_business_regular',
				'registered_business_composition',
				'unregistered_business',
				'consumer',
				'overseas',
				'special_economic_zone',
				'deemed_export',
				'uin_holders',
			],
			default: 'unregistered_business',
		},
		gstin: { type: String, default: '' },
		pan: { type: String, default: '' },

		// Step 3 — contact details
		phone: { type: String },
		mobile: { type: String, default: '' },
		email: { type: String },
		website: { type: String, default: '' },

		// Step 4 — tags
		tags: { type: [vendorTagSchema], default: [] },

		// Step 5 — sales & purchase
		sales: { type: salesInfoSchema, default: () => ({}) },
		purchase: { type: purchaseInfoSchema, default: () => ({}) },
		inventory: { type: inventoryInfoSchema, default: () => ({}) },
		misc: { type: miscInfoSchema, default: () => ({}) },

		// Step 6 — accounting (bank accounts + entries)
		bankAccounts: { type: [vendorBankAccountSchema], default: [] },
		accounting: { type: accountingInfoSchema, default: () => ({}) },

		// Step 7 — internal notes
		warnings: { type: warningsSchema, default: () => ({}) },
		internalNotes: { type: String, default: '' },

		// Legacy flat fields — retained for backward read compatibility with existing records/reports/PDF templates.
		contactPerson: { type: String },
		city: { type: String },
		state: { type: String },
		country: { type: String },
		zipCode: { type: String },
		taxNumber: { type: String },
		paymentTerms: { type: String }, // e.g. "Net 30" — superseded by sales.paymentTerms / purchase.paymentTerms
		notes: { type: String }, // superseded by internalNotes

		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
		/** Org approval lifecycle: draft → submitted → approved | approval_declined. Omitted on legacy rows means approved. */
		orgApprovalStatus: {
			type: String,
			enum: ['draft', 'submitted', 'approval_declined', 'approved'],
		},
		status: { type: String, enum: ['active', 'inactive'], default: 'active' },
		createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
		updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
		deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
		deletedAt: { type: Date },
	},
	{ timestamps: true },
)

vendorSchema.index({ organizationId: 1 })
vendorSchema.index({ name: 1 })
vendorSchema.index({ email: 1 })
vendorSchema.index({ gstin: 1 })
vendorSchema.index({ pan: 1 })
vendorSchema.index({ deletedAt: 1 })

export const Vendor = model('Vendor', vendorSchema)
