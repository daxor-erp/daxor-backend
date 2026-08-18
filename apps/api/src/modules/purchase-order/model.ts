import { model, Schema } from 'mongoose'

/**
 * PO line — now references the Product catalog (Phase 2) instead of the legacy Item master.
 * itemId/itemDescription are kept only for backward-compatible reads of pre-rework documents.
 */
const poItemSchema = new Schema(
	{
		/** product (default) | section | note — mirrors Odoo's catalog/section/note pseudo-line types. */
		lineType: { type: String, enum: ['product', 'section', 'note'], default: 'product' },
		productId: { type: Schema.Types.ObjectId, ref: 'Product' },
		variantId: { type: Schema.Types.ObjectId, ref: 'ProductVariant' },
		/** Denormalized for display without a Product lookup. */
		productName: { type: String },
		hsnSac: { type: String },
		quantity: { type: Number, required: true, default: 0 },
		uomId: { type: Schema.Types.ObjectId, ref: 'Uom' },
		/** Selected packaging from the product's packagings[] — e.g. "Box of 10". */
		packagingId: { type: Schema.Types.ObjectId, default: null },
		packagingQty: { type: Number, default: 0 },
		unitPrice: { type: Number, default: 0 },
		taxIds: { type: [Schema.Types.ObjectId], ref: 'TaxRate', default: [] },
		discountPercent: { type: Number, default: 0, min: 0, max: 100 },
		/** qty * unitPrice * (1 - discountPercent/100) */
		lineUntaxed: { type: Number, default: 0 },
		lineTax: { type: Number, default: 0 },
		lineTotal: { type: Number, default: 0 },
		qtyReceived: { type: Number, default: 0 },
		qtyBilled: { type: Number, default: 0 },
		/** Set when the vendor confirms no further delivery is coming for this line (backorder closed). */
		closedForReceiving: { type: Boolean, default: false },
		/** Free text — used for section headers and note lines (lineType != 'product'). */
		note: { type: String, default: '' },

		// Legacy (pre-rework) fields — retained for backward-compatible reads only.
		itemId: { type: Schema.Types.ObjectId, ref: 'Item' },
		itemDescription: { type: String },
	},
	{ _id: true },
)

const purchaseOrderSchema = new Schema(
	{
		seqNo: { type: String, unique: true, sparse: true },
		vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
		vendorName: { type: String },
		gstTreatment: { type: String, default: '' },
		vendorReference: { type: String, default: '' },
		currency: { type: String, default: 'INR' },
		/** Currency units per 1 unit of the organization's base currency (INR). 1 for INR POs. Snapshotted at create/update time. */
		exchangeRate: { type: Number, default: 1 },
		/** totalAmount converted to the organization's base currency (INR) using exchangeRate — used for accounting/reporting. */
		totalAmountBaseCurrency: { type: Number, default: 0 },
		/** Free-text/ID reference to a purchase agreement or blanket order this RFQ was raised against. */
		agreement: { type: String, default: '' },
		/** "Other Information" — Source Document / Incoterms, mirrors Odoo's PO "Other Information" tab. */
		sourceDocument: { type: String, default: '' },
		incoterms: { type: String, default: '' },

		projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
		projectName: { type: String },

		orderDate: { type: Date },
		/** Deadline by which vendor should respond to the RFQ. */
		orderDeadline: { type: Date },
		/** Expected arrival of goods (renamed from legacy deliveryDate, which is kept as an alias). */
		expectedArrival: { type: Date },
		deliveryDate: { type: Date }, // legacy alias for expectedArrival
		askConfirmation: { type: Boolean, default: false },
		/** Timestamp of the last standalone "Print RFQ" action (distinct from Send by Email). */
		lastPrintedAt: { type: Date, default: null },

		deliverToLocationId: { type: Schema.Types.ObjectId, ref: 'Warehouse' },
		paymentTerms: { type: Schema.Types.ObjectId, ref: 'PaymentTerm' },
		deliveryTerms: { type: String, default: '' },
		buyerId: { type: Schema.Types.ObjectId, ref: 'User' },
		/** Free-text fiscal position, e.g. "Within Tamil Nadu" — drives the CGST/SGST vs IGST split heuristic. */
		fiscalPosition: { type: String, default: '' },
		confirmationDate: { type: Date },

		subtotal: { type: Number, default: 0 }, // legacy alias for untaxedAmount
		untaxedAmount: { type: Number, default: 0 },
		taxAmount: { type: Number, default: 0 },
		taxBreakdown: {
			cgst: { type: Number, default: 0 },
			sgst: { type: Number, default: 0 },
			igst: { type: Number, default: 0 },
		},
		totalAmount: { type: Number, default: 0 },

		/**
		 * rfq → rfq_sent → submitted → approved → purchase_order → sent
		 *   → received | partially_received → billed | partially_billed
		 * cancelled | rejected | locked are terminal/side states.
		 * 'debited' retained for backward compatibility with vendor-debit-note.
		 */
		status: {
			type: String,
			enum: [
				'rfq',
				'rfq_sent',
				'submitted',
				'approved',
				'purchase_order',
				'sent',
				'received',
				'partially_received',
				'billed',
				'partially_billed',
				'debited',
				'cancelled',
				'rejected',
				'locked',
			],
			default: 'rfq',
		},
		/** Derived from line qtyReceived vs quantity — surfaced separately per Odoo's Other Information tab. */
		receiptStatus: { type: String, enum: ['not_received', 'partially_received', 'received'], default: 'not_received' },
		billingStatus: { type: String, enum: ['not_billed', 'partially_billed', 'billed'], default: 'not_billed' },

		items: [poItemSchema],
		notes: { type: String },
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
		createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
		updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
		deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
		deletedAt: { type: Date },
		/** Optimistic-concurrency counter — incremented on every update; edit calls may pass expectedVersion to detect conflicting concurrent edits. */
		version: { type: Number, default: 0 },
	},
	{ timestamps: true },
)

purchaseOrderSchema.index({ vendorId: 1 })
purchaseOrderSchema.index({ projectId: 1 })
purchaseOrderSchema.index({ organizationId: 1 })
purchaseOrderSchema.index({ status: 1 })
purchaseOrderSchema.index({ deletedAt: 1 })

export const PurchaseOrder = model('PurchaseOrder', purchaseOrderSchema)
