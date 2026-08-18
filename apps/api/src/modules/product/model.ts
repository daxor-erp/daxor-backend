import { model, Schema } from 'mongoose'

const attributeLineSchema = new Schema(
	{
		attributeId: { type: Schema.Types.ObjectId, ref: 'Attribute', required: true },
		/** Selected value ids from Attribute.values for this product (subset used to generate variants). */
		valueIds: { type: [Schema.Types.ObjectId], default: [] },
	},
	{ _id: false },
)

const vendorPricelistLineSchema = new Schema(
	{
		vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
		leadTimeDays: { type: Number, default: 0 },
		minQty: { type: Number, default: 1 },
		price: { type: Number, default: 0 },
	},
	{ timestamps: true },
)

/** Per-warehouse (optional) min/max reordering rule — drives the "Reordering Rules" smart button + Replenish suggestion. */
const reorderingRuleSchema = new Schema(
	{
		warehouseId: { type: Schema.Types.ObjectId, ref: 'Warehouse', default: null },
		minQty: { type: Number, default: 0 },
		maxQty: { type: Number, default: 0 },
	},
	{ timestamps: true },
)

/** Product packaging option (e.g. "Box of 10") — selectable on PO lines via packagingId. */
const packagingLineSchema = new Schema(
	{
		name: { type: String, required: true },
		qtyPerPackage: { type: Number, required: true, default: 1 },
		barcode: { type: String, default: '' },
	},
	{ timestamps: true },
)

const productSchema = new Schema(
	{
		// Identity
		seqNo: { type: String, unique: true, sparse: true },
		name: { type: String, required: true },
		/** Internal reference / SKU — unique per org; auto-generated from seqNo when left empty. */
		internalReference: { type: String, default: '' },
		barcode: { type: String, default: '' },
		hsnSac: { type: String, default: '' },
		images: [{ type: String }],
		notes: { type: String, default: '' },

		// Flags
		canBeSold: { type: Boolean, default: false },
		canBePurchased: { type: Boolean, default: true },
		canBeExpensed: { type: Boolean, default: false },

		// Type
		productType: { type: String, enum: ['goods', 'service', 'combo'], default: 'goods' },
		trackInventory: { type: Boolean, default: true },
		/** none | lot | serial — tracking method for goods (can start as none). */
		trackingMethod: { type: String, enum: ['none', 'lot', 'serial'], default: 'none' },

		// Pricing
		salesPrice: { type: Number, default: 0 },
		costPrice: { type: Number, default: 0 },
		uomId: { type: Schema.Types.ObjectId, ref: 'Uom', default: null },
		purchaseUomId: { type: Schema.Types.ObjectId, ref: 'Uom', default: null },
		salesTaxIds: { type: [Schema.Types.ObjectId], ref: 'TaxRate', default: [] },
		purchaseTaxIds: { type: [Schema.Types.ObjectId], ref: 'TaxRate', default: [] },

		categoryId: { type: Schema.Types.ObjectId, ref: 'ProductCategory', default: null },

		// Attributes & variants
		attributeLines: { type: [attributeLineSchema], default: [] },

		// Purchase
		vendorPricelist: { type: [vendorPricelistLineSchema], default: [] },
		packagings: { type: [packagingLineSchema], default: [] },

		// Inventory
		reorderingRules: { type: [reorderingRuleSchema], default: [] },

		// Accounting (inherits from category if left blank)
		incomeAccount: { type: String, default: '' },
		expenseAccount: { type: String, default: '' },
		stockAccount: { type: String, default: '' },

		status: { type: String, enum: ['active', 'inactive', 'discontinued'], default: 'active' },
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
		createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
		updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
		deletedAt: { type: Date, default: null },
		deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },

		// Legacy flat fields — retained for backward read compatibility with the earlier Product shape.
		sku: { type: String },
		description: { type: String },
		category: { type: String },
		brand: { type: String },
		unit: { type: String },
		price: { type: Number },
		taxRate: { type: Number },
		minStockLevel: { type: Number },
		maxStockLevel: { type: Number },
		reorderPoint: { type: Number },
	},
	{ timestamps: true },
)

productSchema.index({ internalReference: 1, organizationId: 1 }, { unique: true, sparse: true })
productSchema.index({ organizationId: 1 })
productSchema.index({ categoryId: 1 })
productSchema.index({ status: 1 })
productSchema.index({ canBePurchased: 1 })
productSchema.index({ deletedAt: 1 })

export const Product = model('Product', productSchema)
