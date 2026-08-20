import { GraphQLValidationError } from '@repo/errors'
import { ProductStockRepository, ProductStockMovementRepository } from './repository'
import { ProductRepository } from '../product/repository'
import { PurchaseOrder } from '../purchase-order/model'

export class ProductStockService {
	private stockRepo: ProductStockRepository
	private movementRepo: ProductStockMovementRepository
	private productRepo: ProductRepository

	constructor() {
		this.stockRepo = new ProductStockRepository()
		this.movementRepo = new ProductStockMovementRepository()
		this.productRepo = new ProductRepository()
	}

	/** Total on-hand quantity for a product, summed across all warehouses. */
	async getOnHandQty(productId: string): Promise<number> {
		return this.stockRepo.sumOnHandForProduct(productId)
	}

	/** Total QC-hold quantity (received but awaiting inspection). */
	async getQcHoldQty(productId: string): Promise<number> {
		const rows = await this.stockRepo.findByProduct(productId)
		return rows.reduce((s, r: any) => s + (r.qcHoldQty ?? 0), 0)
	}

	/**
	 * Forecasted = on hand + quantity still incoming on open (confirmed but not fully received) POs.
	 * Mirrors Odoo's "Forecasted" smart button, minus outgoing sales demand (not modeled here).
	 */
	async getForecastedQty(productId: string): Promise<number> {
		const onHand = await this.getOnHandQty(productId)
		const openStatuses = ['purchase_order', 'sent', 'partially_received']
		const orders = await PurchaseOrder.find({
			'items.productId': productId,
			status: { $in: openStatuses },
			deletedAt: null,
		})
			.lean()
			.exec()
		let incoming = 0
		for (const po of orders as any[]) {
			for (const line of po.items ?? []) {
				if (String(line.productId) === String(productId)) {
					incoming += Math.max(0, Number(line.quantity ?? 0) - Number(line.qtyReceived ?? 0))
				}
			}
		}
		return onHand + incoming
	}

	/** Total quantity ever purchased (ordered) for this product across confirmed-or-later POs. */
	async getPurchasedQty(productId: string): Promise<number> {
		const countedStatuses = [
			'purchase_order',
			'sent',
			'received',
			'partially_received',
			'billed',
			'partially_billed',
			'locked',
		]
		const orders = await PurchaseOrder.find({
			'items.productId': productId,
			status: { $in: countedStatuses },
			deletedAt: null,
		})
			.lean()
			.exec()
		let purchased = 0
		for (const po of orders as any[]) {
			for (const line of po.items ?? []) {
				if (String(line.productId) === String(productId)) {
					purchased += Number(line.quantity ?? 0)
				}
			}
		}
		return purchased
	}

	async listMovements(productId: string) {
		return this.movementRepo.findByProduct(productId)
	}

	/**
	 * "Update Quantity" action — sets the on-hand quantity for a product/warehouse to an
	 * absolute value and records the signed delta as a stock movement for audit history.
	 */
	async updateQuantity(
		productId: string,
		newQty: number,
		userId: string,
		options: { warehouseId?: string | null; notes?: string; organizationId: string },
	) {
		const warehouseId = options.warehouseId ?? null
		const existing = await this.stockRepo.findByProductAndWarehouse(productId, warehouseId)
		const previousQty = existing?.onHandQty ?? 0
		const delta = Number(newQty) - previousQty

		let stock
		if (existing) {
			stock = await this.stockRepo.update(String(existing._id), { onHandQty: newQty })
		} else {
			stock = await this.stockRepo.create({
				productId,
				warehouseId,
				onHandQty: newQty,
				organizationId: options.organizationId,
			} as any)
		}

		await this.movementRepo.create({
			productId,
			warehouseId,
			movementType: 'manual_update',
			quantityDelta: delta,
			resultingQty: newQty,
			notes: options.notes ?? '',
			referenceModule: 'product',
			organizationId: options.organizationId,
			createdBy: userId,
		} as any)

		return stock
	}

	/** Applies an incoming receipt (e.g. from a PO) to on-hand stock. Positive delta only.
	 *  Also updates AVCO (Average Cost) running weighted average. */
	async applyReceipt(
		productId: string,
		qty: number,
		options: { warehouseId?: string | null; organizationId: string; referenceId?: string; unitCost?: number },
	) {
		if (qty <= 0) return null
		const warehouseId = options.warehouseId ?? null
		const existing = await this.stockRepo.findByProductAndWarehouse(productId, warehouseId)
		const previousQty = existing?.onHandQty ?? 0
		const resultingQty = previousQty + qty

		// AVCO update: new_avco = (prev_qty * prev_avco + incoming_qty * unit_cost) / result_qty
		const prevAvco = Number((existing as any)?.averageCost ?? 0)
		const unitCost = Number(options.unitCost ?? 0)
		const newAvco = resultingQty > 0
			? Math.round(((previousQty * prevAvco + qty * unitCost) / resultingQty) * 100_000) / 100_000
			: 0
		const newInventoryValue = Math.round(resultingQty * newAvco * 100) / 100

		let stock
		if (existing) {
			stock = await this.stockRepo.update(String(existing._id), {
				onHandQty: resultingQty,
				averageCost: newAvco,
				inventoryValue: newInventoryValue,
			})
		} else {
			stock = await this.stockRepo.create({
				productId,
				warehouseId,
				onHandQty: resultingQty,
				averageCost: newAvco,
				inventoryValue: newInventoryValue,
				organizationId: options.organizationId,
			} as any)
		}

		await this.movementRepo.create({
			productId,
			warehouseId,
			movementType: 'purchase_receipt',
			quantityDelta: qty,
			resultingQty,
			referenceModule: 'purchase-order',
			referenceId: options.referenceId,
			organizationId: options.organizationId,
		} as any)

		return stock
	}

	/**
	 * "Replenish" action — creates a draft RFQ for this product using the cheapest entry in the
	 * product's vendor pricelist. Throws if the product has no vendor pricelist configured, since
	 * guessing an arbitrary vendor would be incorrect.
	 */
	async replenish(
		productId: string,
		qty: number,
		userId: string,
	): Promise<{ vendorId: string; unitPrice: number; qty: number; productId: string }> {
		const product = await this.productRepo.findById(productId)
		if (!product) throw new GraphQLValidationError('Product not found')
		const pricelist = (product as any).vendorPricelist ?? []
		if (!pricelist.length) {
			throw new GraphQLValidationError(
				'This product has no vendor pricelist configured. Add at least one vendor under the Purchase tab before replenishing.',
			)
		}
		const cheapest = [...pricelist].sort((a: any, b: any) => (a.price ?? 0) - (b.price ?? 0))[0]
		const requestedQty = qty > 0 ? qty : Math.max(1, Number(cheapest.minQty) || 1)

		return {
			vendorId: String(cheapest.vendorId),
			unitPrice: Number(cheapest.price) || 0,
			qty: requestedQty,
			productId,
		}
	}

	// ---------------------------------------------------------------------------
	// Gap 17 — QC hold: incoming goods held for inspection before going to available stock
	// ---------------------------------------------------------------------------

	/**
	 * Move received goods into a QC inspection hold instead of immediately into available stock.
	 * Called by the PO receive flow when the product or warehouse requires QC.
	 * In this implementation, QC is opt-in per receipt call (allowOverReceipt carries a
	 * `requiresQc` companion flag — see receive() TODO). For now, an explicit API is provided.
	 */
	async holdForQc(
		productId: string,
		qty: number,
		options: { warehouseId?: string | null; organizationId: string; referenceId?: string },
	) {
		if (qty <= 0) return null
		const warehouseId = options.warehouseId ?? null
		const existing = await this.stockRepo.findByProductAndWarehouse(productId, warehouseId)
		const prevHold = Number((existing as any)?.qcHoldQty ?? 0)
		const newHold = prevHold + qty

		let stock
		if (existing) {
			stock = await this.stockRepo.update(String(existing._id), { qcHoldQty: newHold })
		} else {
			stock = await this.stockRepo.create({
				productId,
				warehouseId,
				onHandQty: 0,
				qcHoldQty: newHold,
				organizationId: options.organizationId,
			} as any)
		}

		await this.movementRepo.create({
			productId,
			warehouseId,
			movementType: 'qc_hold',
			quantityDelta: qty,
			resultingQty: Number((stock as any)?.onHandQty ?? 0),
			notes: 'Held for QC inspection',
			referenceModule: 'purchase-order',
			referenceId: options.referenceId,
			organizationId: options.organizationId,
		} as any)

		return stock
	}

	/**
	 * Release goods from QC hold to available stock (pass) or discard them (fail/scrap).
	 * `decision` = 'pass' | 'fail'
	 * On pass: qcHoldQty decrements, onHandQty increments.
	 * On fail: qcHoldQty decrements (goods scrapped / returned to vendor — caller handles vendor return).
	 */
	async releaseFromQc(
		productId: string,
		qty: number,
		decision: 'pass' | 'fail',
		options: { warehouseId?: string | null; organizationId: string; notes?: string },
	) {
		if (qty <= 0) return null
		const warehouseId = options.warehouseId ?? null
		const existing = await this.stockRepo.findByProductAndWarehouse(productId, warehouseId)
		if (!existing) throw new GraphQLValidationError('No QC-hold stock record found for this product/warehouse')
		const currentHold = Number((existing as any).qcHoldQty ?? 0)
		if (qty > currentHold) {
			throw new GraphQLValidationError(
				`Cannot release ${qty} units — only ${currentHold} are currently held for QC.`,
			)
		}
		const newHold = currentHold - qty
		const currentOnHand = Number((existing as any).onHandQty ?? 0)
		const newOnHand = decision === 'pass' ? currentOnHand + qty : currentOnHand

		const stock = await this.stockRepo.update(String(existing._id), {
			qcHoldQty: newHold,
			onHandQty: newOnHand,
		})

		await this.movementRepo.create({
			productId,
			warehouseId,
			movementType: decision === 'pass' ? 'qc_pass' : 'qc_fail',
			quantityDelta: decision === 'pass' ? qty : 0,
			resultingQty: newOnHand,
			notes: options.notes ?? (decision === 'pass' ? 'QC passed' : 'QC failed — scrapped/returned'),
			organizationId: options.organizationId,
		} as any)

		return stock
	}
}
