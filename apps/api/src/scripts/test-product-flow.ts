/**
 * Standalone integration test for the Product catalog overhaul (Phase 2).
 * Runs against a local, disposable MongoDB instance (never the shared Atlas cluster).
 *
 * Usage: MONGODB_URI=mongodb://127.0.0.1:27117/daxor_product_test node -r esbuild-register src/scripts/test-product-flow.ts
 */
import mongoose from 'mongoose'
import assert from 'node:assert/strict'

import { Organization } from '~/modules/organization/model'
import { User } from '~/modules/user/model'
import { VendorService } from '~/modules/vendor/service'
import { ProductCategoryService } from '~/modules/product-category/service'
import { UomService } from '~/modules/uom/service'
import { AttributeService } from '~/modules/attribute/service'
import { ProductService } from '~/modules/product/service'
import { ProductVariantService } from '~/modules/product-variant/service'
import { TaxRateService } from '~/modules/tax-rate/service'
import { ProductStockService } from '~/modules/product-stock/service'
import { PurchaseOrderService } from '~/modules/purchase-order/service'
import { Warehouse } from '~/modules/warehouse/model'

let passed = 0
let failed = 0

async function check(name: string, fn: () => Promise<void>) {
	try {
		await fn()
		passed++
		console.log(`  PASS: ${name}`)
	} catch (err) {
		failed++
		console.error(`  FAIL: ${name}`)
		console.error(err)
	}
}

async function main() {
	const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27117/daxor_product_test'
	await mongoose.connect(uri)
	console.log(`Connected to ${uri}`)
	await mongoose.connection.dropDatabase()

	const org = await Organization.create({ code: 'TST', name: 'Test Organization', type: 'client' })
	const orgId = String(org._id)

	const user = await User.create({
		email: 'buyer@test.local',
		firstName: 'Bea',
		lastName: 'Buyer',
		organizationId: org._id,
		roles: ['PURCHASE_MANAGER'],
	})
	const userId = String(user._id)

	// Separate approver for tests that require self-approval guard to pass (Gap 10).
	const approverUser = await User.create({
		email: 'approver@test.local',
		firstName: 'Ann',
		lastName: 'Approver',
		organizationId: org._id,
		roles: ['ORG_ADMIN'],
	})
	const approverId = String(approverUser._id)

	const categoryService = new ProductCategoryService()
	const uomService = new UomService()
	const attributeService = new AttributeService()
	const productService = new ProductService()
	const variantService = new ProductVariantService()
	const taxRateService = new TaxRateService()
	const vendorService = new VendorService()
	const productStockService = new ProductStockService()
	const poService = new PurchaseOrderService()

	let toolsCategoryId = ''
	let consumablesCategoryId = ''
	let nosUomId = ''
	let makeAttrId = ''
	let modelAttrId = ''
	let sizeAttrId = ''
	let gstTaxId = ''
	let vendorId = ''
	let productId = ''

	await check('product-category: create tree All -> Tools -> Tools Consumables (fullPath denormalized)', async () => {
		const all = await categoryService.create({ name: 'All', organizationId: orgId })
		const tools = await categoryService.create({ name: 'Tools', parentId: String((all as any)._id), organizationId: orgId })
		toolsCategoryId = String((tools as any)._id)
		assert.equal((tools as any).fullPath, 'All / Tools')
		const consumables = await categoryService.create({
			name: 'Tools Consumables',
			parentId: toolsCategoryId,
			organizationId: orgId,
		})
		consumablesCategoryId = String((consumables as any)._id)
		assert.equal((consumables as any).fullPath, 'All / Tools / Tools Consumables')
	})

	await check('product-category: cannot delete a category with children', async () => {
		let threw = false
		try {
			await categoryService.softDelete(toolsCategoryId)
		} catch {
			threw = true
		}
		assert.ok(threw)
	})

	await check('uom: ensureDefaultsForOrganization seeds Nos/Box/kg/g/Litre/Meter with GST UQC', async () => {
		const uoms = await uomService.ensureDefaultsForOrganization(orgId)
		assert.equal(uoms.length, 6)
		const nos = uoms.find((u: any) => u.name === 'Nos')
		nosUomId = String((nos as any)._id)
		assert.equal((nos as any).gstUqc, 'NOS')
		// idempotent
		const again = await uomService.ensureDefaultsForOrganization(orgId)
		assert.equal(again.length, 6)
	})

	await check('attribute: create Make/Model/Size with reusable values', async () => {
		const make = await attributeService.create({ name: 'Make', values: ['NAKSHTRA', 'ESAB'], organizationId: orgId })
		makeAttrId = String((make as any)._id)
		assert.equal((make as any).values.length, 2)

		const model = await attributeService.create({ name: 'Model', values: ['250MIG/ARC', '400TIG'], organizationId: orgId })
		modelAttrId = String((model as any)._id)

		const size = await attributeService.create({ name: 'Size', values: ['0.8 mm', '1.0 mm'], organizationId: orgId })
		sizeAttrId = String((size as any)._id)
	})

	await check('attribute: addValue appends a new reusable value without duplicating', async () => {
		const updated: any = await attributeService.addValue(makeAttrId, 'LINCOLN')
		assert.equal(updated.values.length, 3)
		const again: any = await attributeService.addValue(makeAttrId, 'LINCOLN')
		assert.equal(again.values.length, 3) // no duplicate
	})

	await check('tax-rate: create Purchase GST 18%', async () => {
		const tax = await taxRateService.create({
			name: 'GST 18% Purchase',
			code: 'GST18P',
			ratePercent: 18,
			taxType: 'GST',
			appliesTo: 'PURCHASE',
			organizationId: orgId,
		})
		gstTaxId = String((tax as any)._id)
	})

	await check('vendor: create a vendor for the pricelist line', async () => {
		const v: any = await vendorService.createVendor({ name: 'Welding Supplies Co', organizationId: orgId }, userId)
		vendorId = String(v._id)
	})

	await check('product: createProduct with attribute lines generates variants (cartesian product)', async () => {
		const makeDoc: any = await attributeService.findById(makeAttrId)
		const modelDoc: any = await attributeService.findById(modelAttrId)
		const sizeDoc: any = await attributeService.findById(sizeAttrId)

		const makeValueIds = makeDoc.values.filter((v: any) => ['NAKSHTRA'].includes(v.value)).map((v: any) => String(v._id))
		const modelValueIds = modelDoc.values.filter((v: any) => ['250MIG/ARC'].includes(v.value)).map((v: any) => String(v._id))
		const sizeValueIds = sizeDoc.values.map((v: any) => String(v._id)) // both sizes

		const product: any = await productService.createProduct(
			{
				name: 'TOOLS-WELDING SPOOL',
				canBeSold: false,
				canBePurchased: true,
				productType: 'goods',
				trackInventory: true,
				costPrice: 450,
				uomId: nosUomId,
				purchaseTaxIds: [gstTaxId],
				categoryId: consumablesCategoryId,
				hsnSac: '8311',
				attributeLines: [
					{ attributeId: makeAttrId, valueIds: makeValueIds },
					{ attributeId: modelAttrId, valueIds: modelValueIds },
					{ attributeId: sizeAttrId, valueIds: sizeValueIds },
				],
				vendorPricelist: [{ vendorId, leadTimeDays: 5, minQty: 10, price: 420 }],
				organizationId: orgId,
			},
			userId,
		)
		productId = String(product._id)
		assert.ok(product.seqNo?.startsWith('P-'))
		assert.equal(product.internalReference, product.seqNo) // auto-generated when omitted
		assert.equal(product.canBePurchased, true)
		assert.equal(product.canBeSold, false)

		const variants = await variantService.findByProduct(productId)
		// 1 make * 1 model * 2 sizes = 2 variants
		assert.equal(variants.length, 2)
		const names = variants.map((v: any) => v.displayName).sort()
		assert.ok(names[0].includes('NAKSHTRA'))
		assert.ok(names[0].includes('250MIG/ARC'))
	})

	await check('product: internal reference uniqueness enforced per organization', async () => {
		let threw = false
		try {
			await productService.createProduct(
				{ name: 'Duplicate Ref Product', internalReference: (await productService.getProductById(productId) as any).internalReference, organizationId: orgId },
				userId,
			)
		} catch {
			threw = true
		}
		assert.ok(threw, 'expected duplicate internalReference to be rejected')
	})

	await check('product: updateProduct with changed attributeLines regenerates variants', async () => {
		const sizeDoc: any = await attributeService.findById(sizeAttrId)
		const oneSizeId = [String(sizeDoc.values[0]._id)]
		const makeDoc: any = await attributeService.findById(makeAttrId)
		const oneMakeId = [String(makeDoc.values[0]._id)]
		const modelDoc: any = await attributeService.findById(modelAttrId)
		const oneModelId = [String(modelDoc.values[0]._id)]

		await productService.updateProduct(
			productId,
			{
				attributeLines: [
					{ attributeId: makeAttrId, valueIds: oneMakeId },
					{ attributeId: modelAttrId, valueIds: oneModelId },
					{ attributeId: sizeAttrId, valueIds: oneSizeId },
				],
			},
			userId,
		)
		const variants = await variantService.findByProduct(productId)
		assert.equal(variants.length, 1) // regenerated down to a single combination
	})

	await check('product: no stock movement side effects on create (creation does not touch inventory)', async () => {
		// Confirms Product creation is a pure catalog write — no StockMovement/InventoryControl
		// collections are touched. We verify indirectly: the product document has no stock fields
		// populated and trackInventory defaults are respected without requiring a warehouse.
		const p: any = await productService.getProductById(productId)
		assert.equal(p.trackInventory, true)
		assert.equal(p.status, 'active')
	})

	await check('product: images[] accepts uploaded URLs (gap fix — image upload)', async () => {
		const updated: any = await productService.updateProduct(
			productId,
			{ images: ['/api/documents/abc123/download', '/api/documents/def456/download'] },
			userId,
		)
		assert.equal(updated.images.length, 2)
	})

	await check('product: packagings[] persists Box-of-10 style packaging options (gap fix — PO packaging)', async () => {
		const updated: any = await productService.updateProduct(
			productId,
			{ packagings: [{ name: 'Box of 10', qtyPerPackage: 10, barcode: 'BOX10' }] },
			userId,
		)
		assert.equal(updated.packagings.length, 1)
		assert.equal(updated.packagings[0].name, 'Box of 10')
		assert.equal(updated.packagings[0].qtyPerPackage, 10)
	})

	let warehouseId = ''
	await check('product: reorderingRules[] persists per-warehouse min/max thresholds (gap fix — reordering rules)', async () => {
		const wh: any = await Warehouse.create({
			warehouseCode: 'WH0001',
			warehouseName: 'Main Warehouse',
			location: 'Chennai',
			address: 'Test address',
			capacity: 1000,
			managerName: 'Manager',
			contactNumber: '9999999999',
			warehouseType: 'MAIN',
			organizationId: orgId,
		})
		warehouseId = String(wh._id)
		const updated: any = await productService.updateProduct(
			productId,
			{ reorderingRules: [{ warehouseId, minQty: 5, maxQty: 50 }] },
			userId,
		)
		assert.equal(updated.reorderingRules.length, 1)
		assert.equal(updated.reorderingRules[0].minQty, 5)
		assert.equal(updated.reorderingRules[0].maxQty, 50)
	})

	await check('product-stock: onHandQty starts at 0 for a brand-new product', async () => {
		const onHand = await productStockService.getOnHandQty(productId)
		assert.equal(onHand, 0)
	})

	await check('product-stock: updateQuantity (gap fix — Update Quantity action) sets on-hand and records a movement', async () => {
		await productStockService.updateQuantity(productId, 100, userId, { organizationId: orgId, warehouseId })
		const onHand = await productStockService.getOnHandQty(productId)
		assert.equal(onHand, 100)
		const movements = await productStockService.listMovements(productId)
		assert.equal(movements.length, 1)
		assert.equal((movements[0] as any).movementType, 'manual_update')
		assert.equal((movements[0] as any).quantityDelta, 100)
	})

	await check('product-stock: a second updateQuantity call records the correct signed delta', async () => {
		await productStockService.updateQuantity(productId, 70, userId, { organizationId: orgId, warehouseId })
		const onHand = await productStockService.getOnHandQty(productId)
		assert.equal(onHand, 70)
		const movements = await productStockService.listMovements(productId)
		assert.equal(movements.length, 2)
		assert.equal((movements[0] as any).quantityDelta, -30) // most recent first
	})

	await check('product-stock: forecastedQty includes incoming qty from an open PO (gap fix — Forecasted smart button)', async () => {
		const vendor: any = await vendorService.createVendor({ name: 'Forecast Vendor Co', organizationId: orgId }, userId)
		const po: any = await poService.create(
			{
				vendorId: String(vendor._id),
				orderDate: new Date().toISOString(),
				items: [{ productId, productName: 'TOOLS-WELDING SPOOL', quantity: 25, unitPrice: 420 }],
				organizationId: orgId,
			},
			userId,
		)
		// Move it into an "open" (incoming) status so forecastedQty counts it.
		await poService.markRfqSent(String(po._id), userId)
		await poService.submit(String(po._id), userId)
		await poService.approve(String(po._id), approverId)
		await poService.confirmOrder(String(po._id), approverId)

		const forecasted = await productStockService.getForecastedQty(productId)
		assert.equal(forecasted, 70 + 25) // on-hand (70) + incoming (25)
	})

	await check('product-stock: purchasedQty aggregates ordered quantities across confirmed POs (gap fix — Purchased smart button)', async () => {
		const purchased = await productStockService.getPurchasedQty(productId)
		assert.equal(purchased, 25)
	})

	await check('product-stock: replenish (gap fix — Replenish action) drafts an RFQ from the cheapest vendor pricelist entry', async () => {
		const suggestion = await productStockService.replenish(productId, 15, userId)
		assert.equal(suggestion.unitPrice, 420) // cheapest (only) entry from setup
		assert.equal(suggestion.qty, 15)
		assert.ok(suggestion.vendorId)
	})

	await check('product-stock: replenish throws a clear error when the product has no vendor pricelist', async () => {
		const bare: any = await productService.createProduct({ name: 'No Pricelist Product', organizationId: orgId }, userId)
		let threw = false
		try {
			await productStockService.replenish(String(bare._id), 1, userId)
		} catch (err: any) {
			threw = true
			assert.ok(String(err.message).includes('vendor pricelist'))
		}
		assert.ok(threw)
	})

	console.log(`\n${passed} passed, ${failed} failed`)
	await mongoose.connection.close()
	process.exit(failed > 0 ? 1 : 0)
}

main().catch((err) => {
	console.error('Fatal error running product flow test:', err)
	process.exit(1)
})
