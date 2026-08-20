import { model, Schema } from 'mongoose'

/**
 * Lightweight, additive stock ledger keyed by Product (catalog rework), kept deliberately
 * separate from the legacy Item-keyed InventoryControl/StockMovement pair used by
 * GRN/stock-adjustment/stock-transfer. This lets Product smart buttons (On Hand, Forecasted,
 * Purchased) and the "Update Quantity" action work against real data without touching the
 * legacy Item-based receiving pipeline.
 */
const productStockSchema = new Schema(
	{
		productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
		warehouseId: { type: Schema.Types.ObjectId, ref: 'Warehouse', default: null },
		onHandQty: { type: Number, default: 0 },
		/** Quantity currently held in QC inspection — received but not yet cleared for use. */
		qcHoldQty: { type: Number, default: 0 },
		/**
		 * AVCO (Average Cost) — running weighted average unit cost.
		 * Updated on every receipt: new_avco = (current_qty * current_avco + incoming_qty * unit_cost)
		 *                                      / (current_qty + incoming_qty)
		 * Used to value COGS on each delivery (Dr COGS = qty_delivered × avco).
		 */
		averageCost: { type: Number, default: 0 },
		/** Total inventory value at AVCO cost = onHandQty × averageCost */
		inventoryValue: { type: Number, default: 0 },
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
	},
	{ timestamps: true },
)

productStockSchema.index({ productId: 1, warehouseId: 1 }, { unique: true })
productStockSchema.index({ organizationId: 1 })

export const ProductStock = model('ProductStock', productStockSchema)

const productStockMovementSchema = new Schema(
	{
		productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
		warehouseId: { type: Schema.Types.ObjectId, ref: 'Warehouse', default: null },
		/** manual_update | purchase_receipt | replenish_rfq | adjustment */
		movementType: { type: String, required: true },
		/** Signed delta applied to onHandQty (positive = stock in, negative = stock out). */
		quantityDelta: { type: Number, required: true },
		/** Resulting onHandQty after this movement — recorded for audit/history display. */
		resultingQty: { type: Number, required: true },
		notes: { type: String, default: '' },
		referenceModule: { type: String, default: '' },
		referenceId: { type: Schema.Types.ObjectId, default: null },
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
		createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
	},
	{ timestamps: true },
)

productStockMovementSchema.index({ productId: 1, createdAt: -1 })
productStockMovementSchema.index({ organizationId: 1 })

export const ProductStockMovement = model('ProductStockMovement', productStockMovementSchema)
