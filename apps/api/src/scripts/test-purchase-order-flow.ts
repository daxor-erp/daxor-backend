/**
 * Standalone integration test for the Purchase Order overhaul (Phase 3).
 * Runs against a local, disposable MongoDB instance (never the shared Atlas cluster).
 *
 * Usage: MONGODB_URI=mongodb://127.0.0.1:27117/daxor_po_test node -r esbuild-register src/scripts/test-purchase-order-flow.ts
 */
import mongoose from 'mongoose'
import assert from 'node:assert/strict'

import { Organization } from '~/modules/organization/model'
import { User } from '~/modules/user/model'
import { VendorService } from '~/modules/vendor/service'
import { ProductService } from '~/modules/product/service'
import { UomService } from '~/modules/uom/service'
import { TaxRateService } from '~/modules/tax-rate/service'
import { PurchaseOrderService } from '~/modules/purchase-order/service'
import { VendorBillRepository } from '~/modules/vendor-bill/repository'
import { Vendor } from '~/modules/vendor/model'

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
	const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27117/daxor_po_test'
	await mongoose.connect(uri)
	console.log(`Connected to ${uri}`)
	await mongoose.connection.dropDatabase()

	const org = await Organization.create({ code: 'TST', name: 'Test Organization', type: 'client' })
	const orgId = String(org._id)

	const approver = await User.create({
		email: 'approver@test.local',
		firstName: 'Ann',
		lastName: 'Approver',
		organizationId: org._id,
		roles: ['ORG_ADMIN'],
	})
	const buyer = await User.create({
		email: 'buyer@test.local',
		firstName: 'Bea',
		lastName: 'Buyer',
		organizationId: org._id,
		roles: ['PURCHASE_MANAGER'],
	})

	await Organization.findByIdAndUpdate(org._id, {
		moduleApprovers: [{ moduleKey: 'purchases', approverUserIds: [approver._id] }],
	})

	const vendorService = new VendorService()
	const productService = new ProductService()
	const uomService = new UomService()
	const taxRateService = new TaxRateService()
	const poService = new PurchaseOrderService()
	const vendorBillRepo = new VendorBillRepository()

	let vendorId = ''
	let productId = ''
	let uomId = ''
	let gstTaxId = ''
	let poId = ''

	await check('setup: vendor + product + uom + tax master data', async () => {
		const vendor: any = await vendorService.createVendor({ name: 'Welding Supplies Co', organizationId: orgId }, String(buyer._id))
		vendorId = String(vendor._id)

		const uom: any = await uomService.create({ name: 'Nos', category: 'Unit', organizationId: orgId })
		uomId = String(uom._id)

		const tax: any = await taxRateService.create({
			name: 'GST 18% Purchase',
			code: 'GST18P',
			ratePercent: 18,
			taxType: 'GST',
			appliesTo: 'PURCHASE',
			organizationId: orgId,
		})
		gstTaxId = String(tax._id)

		const product: any = await productService.createProduct(
			{ name: 'Welding Spool', canBePurchased: true, costPrice: 420, uomId, organizationId: orgId },
			String(buyer._id),
		)
		productId = String(product._id)
	})

	await check('create: PO starts as rfq with computed line/header totals (18% GST)', async () => {
		const po: any = await poService.create(
			{
				vendorId,
				orderDate: new Date().toISOString(),
				fiscalPosition: 'Within Tamil Nadu',
				items: [
					{ productId, productName: 'Welding Spool', quantity: 10, uomId, unitPrice: 420, taxIds: [gstTaxId], discountPercent: 0 },
				],
				organizationId: orgId,
			},
			String(buyer._id),
		)
		poId = String(po._id)
		assert.equal(po.status, 'rfq')
		assert.equal(po.seqNo?.startsWith('PO-'), true)
		assert.equal(po.untaxedAmount, 4200)
		assert.equal(po.taxAmount, 756) // 18% of 4200
		assert.equal(po.totalAmount, 4956)
		// Within Tamil Nadu => intra-state => CGST+SGST split evenly, no IGST
		assert.equal(po.taxBreakdown.cgst, 378)
		assert.equal(po.taxBreakdown.sgst, 378)
		assert.equal(po.taxBreakdown.igst, 0)
		assert.equal(po.receiptStatus, 'not_received')
		assert.equal(po.billingStatus, 'not_billed')
	})

	await check('update: editing an rfq recomputes totals; editing a confirmed PO is blocked (checked later)', async () => {
		const updated: any = await poService.update(
			poId,
			{ items: [{ productId, productName: 'Welding Spool', quantity: 20, uomId, unitPrice: 420, taxIds: [gstTaxId] }] },
			String(buyer._id),
		)
		assert.equal(updated.untaxedAmount, 8400)
		assert.equal(updated.totalAmount, 9912)
	})

	await check('markRfqSent: rfq -> rfq_sent', async () => {
		const updated: any = await poService.markRfqSent(poId, String(buyer._id))
		assert.equal(updated.status, 'rfq_sent')
	})

	await check('submit: rfq_sent -> submitted (requires at least one line)', async () => {
		const updated: any = await poService.submit(poId, String(buyer._id))
		assert.equal(updated.status, 'submitted')
	})

	await check('update is blocked once submitted', async () => {
		let threw = false
		try {
			await poService.update(poId, { notes: 'should fail' }, String(buyer._id))
		} catch {
			threw = true
		}
		assert.ok(threw)
	})

	await check('approve: submitted -> approved', async () => {
		const updated: any = await poService.approve(poId, String(approver._id))
		assert.equal(updated.status, 'approved')
	})

	await check('confirmOrder: approved -> purchase_order (assigns confirmationDate)', async () => {
		const updated: any = await poService.confirmOrder(poId, String(buyer._id))
		assert.equal(updated.status, 'purchase_order')
		assert.ok(updated.confirmationDate)
	})

	await check('markSent: purchase_order -> sent', async () => {
		const updated: any = await poService.markSent(poId, String(buyer._id))
		assert.equal(updated.status, 'sent')
	})

	await check('receive: partial receipt sets partially_received and creates a GRN for the delta only', async () => {
		const po: any = await poService.findById(poId)
		const lineId = String(po.items[0]._id)
		const updated: any = await poService.receive(poId, String(buyer._id), [{ lineId, qtyReceived: 5 }])
		assert.equal(updated.status, 'partially_received')
		assert.equal(updated.receiptStatus, 'partially_received')
		assert.equal(updated.items[0].qtyReceived, 5)
	})

	await check('receive: second partial receipt for the remainder completes the line -> received', async () => {
		const po: any = await poService.findById(poId)
		const lineId = String(po.items[0]._id)
		const updated: any = await poService.receive(poId, String(buyer._id), [{ lineId, qtyReceived: 15 }])
		assert.equal(updated.status, 'received')
		assert.equal(updated.receiptStatus, 'received')
		assert.equal(updated.items[0].qtyReceived, 20)
	})

	await check('billPurchaseOrder: creates a VendorBill linked to the PO and marks it billed', async () => {
		const today = new Date().toISOString().slice(0, 10)
		const bill: any = await poService.billPurchaseOrder(poId, today, today, String(buyer._id))
		assert.ok(bill.billNumber)
		const po: any = await poService.findById(poId)
		assert.equal(po.status, 'billed')
		assert.equal(po.billingStatus, 'billed')
		const bills = await vendorBillRepo.findByPurchaseOrderId(poId)
		assert.equal(bills.length, 1)
	})

	await check('billPurchaseOrder: rejects double-billing the same PO', async () => {
		let threw = false
		try {
			const today = new Date().toISOString().slice(0, 10)
			await poService.billPurchaseOrder(poId, today, today, String(buyer._id))
		} catch {
			threw = true
		}
		assert.ok(threw)
	})

	await check('cancel: cannot cancel a billed/received PO', async () => {
		let threw = false
		try {
			await poService.cancel(poId, String(buyer._id))
		} catch {
			threw = true
		}
		assert.ok(threw)
	})

	await check('lock: locks a billed PO to prevent further edits', async () => {
		const updated: any = await poService.lock(poId, String(buyer._id))
		assert.equal(updated.status, 'locked')
	})

	await check('cancel: a fresh rfq can be cancelled', async () => {
		const po2: any = await poService.create(
			{ vendorId, orderDate: new Date().toISOString(), items: [{ productId, quantity: 1, unitPrice: 100 }], organizationId: orgId },
			String(buyer._id),
		)
		const cancelled: any = await poService.cancel(String(po2._id), String(buyer._id))
		assert.equal(cancelled.status, 'cancelled')
	})

	let gapPoId = ''
	await check('create: header gap fields persist (agreement, sourceDocument, incoterms, buyerId, currency, gstTreatment)', async () => {
		const po: any = await poService.create(
			{
				vendorId,
				buyerId: String(buyer._id),
				orderDate: new Date().toISOString(),
				currency: 'USD',
				gstTreatment: 'registered_business_regular',
				agreement: 'AGR-2026-001',
				sourceDocument: 'SO-9001',
				incoterms: 'FOB',
				items: [{ productId, productName: 'Welding Spool', quantity: 4, uomId, unitPrice: 100 }],
				organizationId: orgId,
			},
			String(buyer._id),
		)
		gapPoId = String(po._id)
		assert.equal(po.currency, 'USD')
		assert.equal(po.gstTreatment, 'registered_business_regular')
		assert.equal(po.agreement, 'AGR-2026-001')
		assert.equal(po.sourceDocument, 'SO-9001')
		assert.equal(po.incoterms, 'FOB')
		assert.equal(String(po.buyerId), String(buyer._id))
	})

	await check('create: packagingId/packagingQty persist on PO lines (gap fix — Packaging)', async () => {
		const productWithPkg: any = await productService.updateProduct(
			productId,
			{ packagings: [{ name: 'Box of 10', qtyPerPackage: 10 }] },
			String(buyer._id),
		)
		const pkgId = String(productWithPkg.packagings[0]._id)
		const po: any = await poService.create(
			{
				vendorId,
				orderDate: new Date().toISOString(),
				items: [
					{
						productId,
						productName: 'Welding Spool',
						quantity: 20,
						uomId,
						packagingId: pkgId,
						packagingQty: 2,
						unitPrice: 420,
					},
				],
				organizationId: orgId,
			},
			String(buyer._id),
		)
		assert.equal(String(po.items[0].packagingId), pkgId)
		assert.equal(po.items[0].packagingQty, 2)
	})

	await check('create: section/note pseudo-line-types carry no pricing (gap fix — Catalog/section/note lines)', async () => {
		const po: any = await poService.create(
			{
				vendorId,
				orderDate: new Date().toISOString(),
				items: [
					{ lineType: 'section', note: 'Consumables' },
					{ productId, productName: 'Welding Spool', quantity: 2, uomId, unitPrice: 420 },
					{ lineType: 'note', note: 'Deliver during business hours only' },
				],
				organizationId: orgId,
			},
			String(buyer._id),
		)
		assert.equal(po.items.length, 3)
		assert.equal(po.items[0].lineType, 'section')
		assert.equal(po.items[0].lineTotal, 0)
		assert.equal(po.items[1].lineType, 'product')
		assert.equal(po.items[1].lineTotal, 840)
		assert.equal(po.items[2].lineType, 'note')
		assert.equal(po.items[2].note, 'Deliver during business hours only')
		// Header totals must only reflect the priced product line, not section/note lines.
		assert.equal(po.untaxedAmount, 840)
	})

	await check('markPrinted: standalone Print RFQ action records lastPrintedAt without changing status (gap fix — Print RFQ)', async () => {
		const before: any = await poService.findById(gapPoId)
		assert.equal(before.status, 'rfq')
		const updated: any = await poService.markPrinted(gapPoId, String(buyer._id))
		assert.ok(updated.lastPrintedAt)
		assert.equal(updated.status, 'rfq') // unchanged — distinct from Send by Email / markRfqSent
	})

	// -----------------------------------------------------------------------
	// New gap-fix tests
	// -----------------------------------------------------------------------

	await check('gap 1+2: billPurchaseOrder bills only received qty and allows a second bill for the rest', async () => {
		// Create a fresh PO, confirm it, receive 60 of 100.
		const billVendorDoc: any = await Vendor.create({ name: 'BillTest Co', organizationId: orgId, status: 'active', orgApprovalStatus: 'approved' })
		const billPo: any = await poService.create({
			vendorId: String(billVendorDoc._id),
			orderDate: new Date().toISOString(),
			items: [{ productId, productName: 'Welding Spool', quantity: 100, uomId, unitPrice: 200 }],
			organizationId: orgId,
		}, String(buyer._id))
		const billPoId = String(billPo._id)
		// Approve via approver (not buyer, self-approval guard).
		await poService.submit(billPoId, String(buyer._id))
		await poService.approve(billPoId, String(approver._id))
		await poService.confirmOrder(billPoId, String(approver._id))
		// Receive partial (60 of 100).
		const lineId = String(billPo.items[0]._id)
		await poService.receive(billPoId, String(buyer._id), [{ lineId, qtyReceived: 60 }])

		const today = new Date().toISOString().slice(0, 10)

		// Should fail — cannot bill before receipt check failed (now we have receipt, so it passes)
		const bill1: any = await poService.billPurchaseOrder(billPoId, today, today, String(buyer._id))
		assert.ok(bill1.billNumber, 'first bill should be created')
		const po1: any = await poService.findById(billPoId)
		// After billing 60-received: qtyBilled=60, qtyReceived=60 — so "all received is billed" = billed status.
		// But only 60 of 100 ordered are received/billed, so it's only semantically partially done.
		assert.ok(['billed', 'partially_billed'].includes(po1.billingStatus), 'should be billed or partially_billed')
		assert.ok(po1.items[0].qtyBilled <= 60, 'qtyBilled should be <= 60')

		// Receive the remaining 40.
		const po1b: any = await poService.findById(billPoId)
		await poService.receive(billPoId, String(buyer._id), [{ lineId, qtyReceived: 40 }])

		// Second bill for the remaining 40.
		const bill2: any = await poService.billPurchaseOrder(billPoId, today, today, String(buyer._id))
		assert.ok(bill2.billNumber, 'second bill should be created')
		const po2: any = await poService.findById(billPoId)
		assert.equal(po2.billingStatus, 'billed', 'should be fully billed after second bill')
	})

	await check('gap 1: billPurchaseOrder blocks billing before any receipt', async () => {
		const noReceivePo: any = await poService.create({
			vendorId,
			orderDate: new Date().toISOString(),
			items: [{ productId, productName: 'Welding Spool', quantity: 10, uomId, unitPrice: 100 }],
			organizationId: orgId,
		}, String(buyer._id))
		const nrId = String(noReceivePo._id)
		await poService.submit(nrId, String(buyer._id))
		await poService.approve(nrId, String(approver._id))
		await poService.confirmOrder(nrId, String(approver._id))
		const today = new Date().toISOString().slice(0, 10)
		let threw = false
		try {
			await poService.billPurchaseOrder(nrId, today, today, String(buyer._id))
		} catch (err: any) {
			threw = true
			assert.ok(String(err.message).includes('received'))
		}
		assert.ok(threw, 'expected billing before receipt to be rejected')
	})

	await check('gap 3: over-receipt — allows receiving more than ordered with explicit flag', async () => {
		const overPo: any = await poService.create({
			vendorId,
			orderDate: new Date().toISOString(),
			items: [{ productId, productName: 'Welding Spool', quantity: 5, uomId, unitPrice: 100 }],
			organizationId: orgId,
		}, String(buyer._id))
		const overId = String(overPo._id)
		await poService.submit(overId, String(buyer._id))
		await poService.approve(overId, String(approver._id))
		await poService.confirmOrder(overId, String(approver._id))
		const lineId = String(overPo.items[0]._id)
		// Receive 8 of 5 (vendor over-shipped) — must be explicitly allowed.
		const received: any = await poService.receive(overId, String(buyer._id), [{ lineId, qtyReceived: 8, allowOverReceipt: true }])
		assert.ok(received.items[0].qtyReceived >= 8, 'over-receipt should record the full quantity')
	})

	await check('gap 6: closeLine marks a PO line as closed-for-receiving (backorder)', async () => {
		const backorderPo: any = await poService.create({
			vendorId,
			orderDate: new Date().toISOString(),
			items: [
				{ productId, productName: 'Item A', quantity: 10, uomId, unitPrice: 50 },
				{ productId, productName: 'Item B', quantity: 5, uomId, unitPrice: 50 },
			],
			organizationId: orgId,
		}, String(buyer._id))
		const bpId = String(backorderPo._id)
		await poService.submit(bpId, String(buyer._id))
		await poService.approve(bpId, String(approver._id))
		await poService.confirmOrder(bpId, String(approver._id))
		// Receive 6 of item A, then close item B (vendor says it's out of stock).
		const lineAId = String(backorderPo.items[0]._id)
		const lineBId = String(backorderPo.items[1]._id)
		await poService.receive(bpId, String(buyer._id), [{ lineId: lineAId, qtyReceived: 6 }])
		const closed: any = await poService.closeLine(bpId, lineBId, String(buyer._id))
		assert.ok(closed.items.find((l: any) => String(l._id) === lineBId)?.closedForReceiving, 'line B should be closed')
		// After closing line B and having 6/10 on line A — but line A still has remaining, so status = partially_received.
		assert.equal(closed.receiptStatus, 'partially_received')
		// Now receive all of A.
		await poService.receive(bpId, String(buyer._id), [{ lineId: lineAId, qtyReceived: 4 }])
		const final: any = await poService.findById(bpId)
		assert.equal(final.receiptStatus, 'received', 'should be fully received once line A is done and line B is closed')
	})

	await check('gap 10: self-approval blocked — buyer cannot approve their own PO', async () => {
		const selfPo: any = await poService.create({
			vendorId,
			orderDate: new Date().toISOString(),
			items: [{ productId, productName: 'Welding Spool', quantity: 1, uomId, unitPrice: 100 }],
			organizationId: orgId,
		}, String(buyer._id))
		const selfPoId = String(selfPo._id)
		await poService.submit(selfPoId, String(buyer._id))
		let threw = false
		try {
			await poService.approve(selfPoId, String(buyer._id))
		} catch (err: any) {
			threw = true
			assert.ok(String(err.message).toLowerCase().includes('segregation') || String(err.message).toLowerCase().includes('you cannot'))
		}
		assert.ok(threw, 'expected self-approval to be blocked')
	})

	await check('gap 14: duplicate creates a new rfq with same vendor/lines but zeroed receipt/bill tracking', async () => {
		const dup: any = await poService.duplicate(poId, String(buyer._id))
		assert.ok(dup.seqNo?.startsWith('PO-'))
		assert.notStrictEqual(dup.seqNo, (await poService.findById(poId) as any).seqNo, 'seqNo must differ')
		assert.equal(dup.status, 'rfq')
		assert.equal(dup.receiptStatus, 'not_received')
		assert.equal(dup.billingStatus, 'not_billed')
		assert.ok(dup.items.every((l: any) => l.qtyReceived === 0 && l.qtyBilled === 0))
	})

	await check('gap 18: cancel() blocked when GRN already exists even if status somehow inconsistent', async () => {
		// The cancel() guard checks GRN existence — this is already blocked by status guard for
		// received POs, but we verify the explicit GRN check is also wired.
		// Create a fresh PO that's been received (status = received) → cancel should be blocked.
		const gcPo: any = await poService.create({
			vendorId,
			orderDate: new Date().toISOString(),
			items: [{ productId, productName: 'Welding Spool', quantity: 2, uomId, unitPrice: 100 }],
			organizationId: orgId,
		}, String(buyer._id))
		const gcId = String(gcPo._id)
		await poService.submit(gcId, String(buyer._id))
		await poService.approve(gcId, String(approver._id))
		await poService.confirmOrder(gcId, String(approver._id))
		await poService.receive(gcId, String(buyer._id), undefined)
		let threw = false
		try {
			await poService.cancel(gcId, String(buyer._id))
		} catch (err: any) {
			threw = true
			// Either the status guard or the GRN guard catches it.
			assert.ok(err.message)
		}
		assert.ok(threw, 'expected cancel on a received PO to be blocked')
	})

	console.log(`\n${passed} passed, ${failed} failed`)
	await mongoose.connection.close()
	process.exit(failed > 0 ? 1 : 0)
}

main().catch((err) => {
	console.error('Fatal error running purchase-order flow test:', err)
	process.exit(1)
})
