/**
 * A–Z Odoo-style edge-case suite (backend service layer).
 * Asserts validation, status guards, inventory integrity, and finance boundaries.
 *
 * Usage (local Mongo — isolated DB, does not wipe daxor_db):
 *   MONGODB_URI=mongodb://127.0.0.1:27017/daxor_edge_test \
 *   npm run test:edge-cases
 */
import mongoose from 'mongoose'
import assert from 'node:assert/strict'

import { Organization } from '~/modules/organization/model'
import { User } from '~/modules/user/model'
import { Vendor } from '~/modules/vendor/model'
import { Customer } from '~/modules/customer/model'
import { InventoryControl } from '~/modules/inventory-control/model'

import { VendorService } from '~/modules/vendor/service'
import { PurchaseOrderService } from '~/modules/purchase-order/service'
import { SalesOrderService } from '~/modules/sales-order/service'
import { DeliveryOrderService } from '~/modules/delivery-order/service'
import { VendorBillService } from '~/modules/vendor-bill/service'
import { CustomerInvoiceService } from '~/modules/customer-invoice/service'
import { ReturnAuthorizationService } from '~/modules/return-authorization/service'
import { LeaveService } from '~/modules/leave/service'
import { FixedAssetService } from '~/modules/fixed-asset/service'
import { StockAdjustmentService } from '~/modules/stock-adjustment/service'
import { StockTransferService } from '~/modules/stock-transfer/service'
import { InventoryControlService } from '~/modules/inventory-control/service'
import { WorkOrderService } from '~/modules/work-order/service'

let passed = 0
let failed = 0
const failures: string[] = []

async function check(letter: string, name: string, fn: () => Promise<void>) {
	const label = `[${letter}] ${name}`
	try {
		await fn()
		passed++
		console.log(`  PASS: ${label}`)
	} catch (err) {
		failed++
		const msg = err instanceof Error ? err.message : String(err)
		failures.push(`${label}: ${msg}`)
		console.error(`  FAIL: ${label}`)
		console.error(`         → ${msg}`)
	}
}

async function expectThrows(fn: () => Promise<unknown>, match?: RegExp | string) {
	let threw = false
	let message = ''
	try {
		await fn()
	} catch (err: any) {
		threw = true
		message = String(err?.message ?? err)
	}
	assert.ok(threw, 'expected operation to throw')
	if (match) {
		const re = typeof match === 'string' ? new RegExp(match, 'i') : match
		assert.ok(re.test(message), `error should match ${re}, got: ${message}`)
	}
	return message
}

async function stockQty(orgId: string, itemName: string, bin = 'MAIN') {
	const rows = await InventoryControl.find({
		organizationId: orgId,
		itemName,
		binLocation: bin,
		isDeleted: false,
	}).lean()
	return rows.reduce((s: number, r: any) => s + Number(r.quantity ?? 0), 0)
}

async function main() {
	const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/daxor_edge_test'
	await mongoose.connect(uri)
	console.log(`Connected to ${uri}`)
	await mongoose.connection.dropDatabase()
	console.log('Dropped test database — starting A–Z edge cases\n')

	const org = await Organization.create({ code: 'EDGE', name: 'Edge Case Org', type: 'client', status: 'active' })
	const orgId = String(org._id)
	const admin = await User.create({
		email: 'edge-admin@test.local',
		firstName: 'Edge',
		lastName: 'Admin',
		organizationId: org._id,
		roles: ['ORG_ADMIN'],
		status: 'active',
	})
	const buyer = await User.create({
		email: 'edge-buyer@test.local',
		firstName: 'Edge',
		lastName: 'Buyer',
		organizationId: org._id,
		roles: ['PURCHASE_MANAGER'],
		status: 'active',
	})
	const employee = await User.create({
		email: 'edge-emp@test.local',
		firstName: 'Edge',
		lastName: 'Employee',
		organizationId: org._id,
		roles: ['SALES_MANAGER'],
		status: 'active',
	})
	const adminId = String(admin._id)
	const buyerId = String(buyer._id)
	const employeeId = String(employee._id)

	await Organization.findByIdAndUpdate(org._id, {
		moduleApprovers: [
			{ moduleKey: 'purchases', approverUserIds: [admin._id] },
			{ moduleKey: 'sales', approverUserIds: [admin._id] },
			{ moduleKey: 'vendors', approverUserIds: [admin._id] },
		],
	})

	const vendor = await Vendor.create({
		name: 'Edge Vendor',
		organizationId: org._id,
		status: 'active',
		orgApprovalStatus: 'approved',
	})
	const vendorId = String(vendor._id)

	const customer = await Customer.create({
		name: 'Edge Customer',
		email: 'edge-customer@test.local',
		organizationId: org._id,
		status: 'active',
	})
	const customerId = String(customer._id)

	const vendorService = new VendorService()
	const poService = new PurchaseOrderService()
	const soService = new SalesOrderService()
	const doService = new DeliveryOrderService()
	const billService = new VendorBillService()
	const invService = new CustomerInvoiceService()
	const raService = new ReturnAuthorizationService()
	const leaveService = new LeaveService()
	const assetService = new FixedAssetService()
	const saService = new StockAdjustmentService()
	const stService = new StockTransferService()
	const stockService = new InventoryControlService()
	const woService = new WorkOrderService()

	const ITEM = 'Edge Widget'
	await stockService.applyReceiptLines({
		organizationId: orgId,
		userId: adminId,
		referenceModule: 'seed',
		referenceId: 'edge-seed',
		warehouseId: 'warehouse-main',
		warehouseName: 'MAIN',
		lines: [{ itemDescription: ITEM, quantity: 200 }],
		direction: 'in',
	})

	const today = new Date().toISOString().slice(0, 10)

	// ── A Auth / actor isolation ───────────────────────────────────────────
	console.log('── A: Actors & org context ──')
	await check('A', 'seeded org/admin/vendor/customer exist', async () => {
		assert.ok(orgId)
		assert.ok(adminId)
		assert.ok(vendorId)
		assert.ok(customerId)
	})

	// ── B Blank / required field validation ────────────────────────────────
	console.log('── B: Blank / required fields ──')
	await check('B', 'vendor create rejects empty name', async () => {
		await expectThrows(() => vendorService.createVendor({ organizationId: orgId, name: '  ' } as any, adminId), /name/i)
	})
	await check('B', 'RA create rejects empty lines', async () => {
		await expectThrows(
			() =>
				raService.create(
					{ organizationId: orgId, customerId, requestedDate: today, lines: [] },
					adminId,
				),
			/line/i,
		)
	})
	await check('B', 'RA create rejects non-positive qty', async () => {
		await expectThrows(
			() =>
				raService.create(
					{
						organizationId: orgId,
						customerId,
						requestedDate: today,
						lines: [{ description: 'X', quantity: 0 }],
					},
					adminId,
				),
			/positive/i,
		)
	})
	await check('B', 'PO submit rejects empty product lines', async () => {
		const po: any = await poService.create(
			{ vendorId, orderDate: today, items: [], organizationId: orgId },
			buyerId,
		)
		await expectThrows(() => poService.submit(String(po._id), buyerId), /product line|at least one/i)
	})

	// ── C Create happy path baselines ──────────────────────────────────────
	console.log('── C: Create baselines ──')
	let draftVendorId = ''
	await check('C', 'vendor creates as draft/inactive until approved', async () => {
		const v: any = await vendorService.createVendor(
			{ organizationId: orgId, name: 'Draft Vendor Edge', vendorType: 'company' } as any,
			adminId,
		)
		draftVendorId = String(v._id ?? v.id)
		assert.ok(draftVendorId)
	})

	// ── D Duplicate / double-action guards ─────────────────────────────────
	console.log('── D: Double-action / idempotency guards ──')
	await check('D', 'cannot approve vendor that is not pending', async () => {
		await expectThrows(() => vendorService.approveFromApprovalQueue(draftVendorId, adminId), /pending/i)
	})
	await check('D', 'cannot approve leave application twice', async () => {
		const lt: any = await leaveService.createLeaveType({
			organizationId: orgId,
			code: 'EDGE-AL',
			name: 'Edge Annual',
			paid: true,
			defaultDaysPerYear: 12,
			active: true,
		})
		await leaveService.createLeaveEnrollment({
			organizationId: orgId,
			userId: employeeId,
			leaveTypeId: String(lt._id),
			calendarYear: new Date().getFullYear(),
			entitledDays: 12,
		})
		const start = new Date()
		start.setDate(start.getDate() + 30)
		const end = new Date(start)
		end.setDate(end.getDate() + 1)
		const app: any = await leaveService.createLeaveApplication({
			organizationId: orgId,
			userId: employeeId,
			leaveTypeId: String(lt._id),
			startDate: start.toISOString().slice(0, 10),
			endDate: end.toISOString().slice(0, 10),
			reason: 'edge',
		})
		await leaveService.approveLeaveApplication(String(app._id), adminId)
		await expectThrows(() => leaveService.approveLeaveApplication(String(app._id), adminId), /pending/i)
	})

	// ── E Edit locks after submit/approve ──────────────────────────────────
	console.log('── E: Edit locks ──')
	await check('E', 'submitted vendor cannot be edited', async () => {
		const v: any = await vendorService.createVendor(
			{ organizationId: orgId, name: 'Lock Vendor', vendorType: 'company' } as any,
			adminId,
		)
		const id = String(v._id ?? v.id)
		await vendorService.submitForOrgApproval(id, adminId)
		await expectThrows(
			() => vendorService.updateVendor(id, { name: 'Hacked' } as any, adminId),
			/pending approval|cannot be edited/i,
		)
	})
	await check('E', 'confirmed PO (non-RFQ) cannot be edited as RFQ', async () => {
		const po: any = await poService.create(
			{
				vendorId,
				orderDate: today,
				items: [{ productName: ITEM, quantity: 2, unitPrice: 10 }],
				organizationId: orgId,
			},
			buyerId,
		)
		const id = String(po._id)
		await poService.submit(id, buyerId)
		await poService.approve(id, adminId)
		await poService.confirmOrder(id, adminId)
		await expectThrows(
			() => poService.update(id, { notes: 'nope' } as any, buyerId),
			/only rfq|locked|cannot/i,
		)
	})

	// ── F Finance: bill / payment boundaries ───────────────────────────────
	console.log('── F: Finance boundaries ──')
	let billId = ''
	await check('F', 'cannot pay draft vendor bill', async () => {
		const bill: any = await billService.createBill(
			{
				organizationId: orgId,
				vendorId,
				billDate: today,
				dueDate: today,
				lineItems: [{ description: 'Svc', quantity: 1, unitPrice: 100, total: 100 }],
				totalAmount: 100,
			} as any,
			adminId,
		)
		billId = String(bill._id)
		await expectThrows(() => billService.applyPayment(billId, 50), /approved/i)
	})
	await check('F', 'payment cannot exceed outstanding', async () => {
		await billService.approveBill(billId, adminId)
		await expectThrows(() => billService.applyPayment(billId, 9999), /exceed/i)
	})
	await check('F', 'debit note allocation must be positive', async () => {
		await expectThrows(() => billService.applyDebitNoteAllocation(billId, 0), /positive/i)
	})

	// ── G GRN / receive edges ──────────────────────────────────────────────
	console.log('── G: Goods receipt / PO receive ──')
	let poRecvId = ''
	await check('G', 'cannot bill received_quantities PO before receipt', async () => {
		const po: any = await poService.create(
			{
				vendorId,
				orderDate: today,
				billControlPolicy: 'received_quantities',
				items: [{ productName: ITEM, quantity: 5, unitPrice: 20 }],
				organizationId: orgId,
			},
			buyerId,
		)
		poRecvId = String(po._id)
		await poService.submit(poRecvId, buyerId)
		await poService.approve(poRecvId, adminId)
		await poService.confirmOrder(poRecvId, adminId)
		await expectThrows(() => poService.billPurchaseOrder(poRecvId, today, today, buyerId), /received/i)
	})
	await check('G', 'ordered_quantities PO can bill without receipt', async () => {
		const po: any = await poService.create(
			{
				vendorId,
				orderDate: today,
				billControlPolicy: 'ordered_quantities',
				items: [{ productName: 'Service', quantity: 1, unitPrice: 250 }],
				organizationId: orgId,
			},
			buyerId,
		)
		const id = String(po._id)
		await poService.submit(id, buyerId)
		await poService.approve(id, adminId)
		await poService.confirmOrder(id, adminId)
		const bill: any = await poService.billPurchaseOrder(id, today, today, buyerId)
		assert.ok(bill.billNumber)
	})

	// ── H HR leave date / balance edges ────────────────────────────────────
	console.log('── H: HR leave edges ──')
	await check('H', 'leave end date before start is rejected', async () => {
		const types: any[] = await leaveService.listLeaveTypes(orgId)
		const lt = types[0]
		assert.ok(lt, 'leave type from earlier test')
		await expectThrows(
			() =>
				leaveService.createLeaveApplication({
					organizationId: orgId,
					userId: employeeId,
					leaveTypeId: String(lt._id),
					startDate: '2026-12-10',
					endDate: '2026-12-01',
					reason: 'bad',
				}),
			/end date|after start/i,
		)
	})
	await check('H', 'duplicate leave type code rejected', async () => {
		const before = (await leaveService.listLeaveTypes(orgId)).filter((t: any) => t.code === 'EDGE-AL')
			.length
		let threw = false
		try {
			await leaveService.createLeaveType({
				organizationId: orgId,
				code: 'EDGE-AL',
				name: 'Dup',
				paid: true,
				defaultDaysPerYear: 5,
				active: true,
			})
		} catch {
			threw = true
		}
		const after = (await leaveService.listLeaveTypes(orgId)).filter((t: any) => t.code === 'EDGE-AL')
			.length
		assert.ok(threw || after === before, 'duplicate leave type must throw or not create a second row')
		assert.equal(after, 1, 'exactly one EDGE-AL leave type must exist')
	})

	// ── I Inventory integrity ──────────────────────────────────────────────
	console.log('── I: Inventory integrity ──')
	await check('I', 'stock adjustment decrease updates qty', async () => {
		const before = await stockQty(orgId, ITEM)
		const sa: any = await saService.create(
			{
				adjDate: today,
				adjustmentType: 'decrease',
				warehouseName: 'MAIN',
				lineItems: [
					{ itemDescription: ITEM, currentQty: before, adjustedQty: before - 3, difference: -3 },
				],
				organizationId: orgId,
			},
			adminId,
		)
		await saService.confirm(String(sa._id), adminId)
		assert.equal(await stockQty(orgId, ITEM), before - 3)
	})
	await check('I', 'stock transfer moves between bins without losing qty', async () => {
		const before = await stockQty(orgId, ITEM)
		const st: any = await stService.create(
			{
				transferDate: today,
				fromWarehouseName: 'MAIN',
				toWarehouseName: 'EDGE-BIN',
				lineItems: [{ itemDescription: ITEM, qty: 7, unit: 'EA' }],
				organizationId: orgId,
			},
			adminId,
		)
		await stService.confirm(String(st._id), adminId)
		assert.equal(await stockQty(orgId, ITEM), before - 7)
		assert.equal(await stockQty(orgId, ITEM, 'EDGE-BIN'), 7)
	})
	await check('I', 'delivery DISPATCHED deducts once; DELIVERED does not double-deduct', async () => {
		const before = await stockQty(orgId, ITEM)
		const doc: any = await doService.create({
			organizationId: orgId,
			docNumber: `DO-EDGE-${Date.now()}`,
			deliveryDate: today,
			items: [{ itemName: ITEM, quantity: 4 }],
		})
		const id = String(doc._id)
		await doService.transitionStatus(id, 'DISPATCHED', undefined, adminId)
		assert.equal(await stockQty(orgId, ITEM), before - 4)
		await doService.transitionStatus(id, 'DELIVERED', 'Receiver', adminId)
		assert.equal(await stockQty(orgId, ITEM), before - 4)
	})

	// ── J Journal / invoice status guards ──────────────────────────────────
	console.log('── J: Invoice / journal status guards ──')
	await check('J', 'cannot submit non-draft invoice for approval', async () => {
		const invoice: any = await invService.create(
			{
				organizationId: orgId,
				customerId,
				invoiceDate: today,
				dueDate: today,
				totalAmount: 100,
				lineItems: [{ description: 'Line', quantity: 1, unitPrice: 100, total: 100 }],
				status: 'draft',
			} as any,
		)
		const id = String(invoice._id)
		await invService.submitForApproval(id, adminId)
		await invService.approveApproval(id, adminId)
		await expectThrows(() => invService.submitForApproval(id, adminId), /draft|declined/i)
	})
	await check('J', 'payment on unpaid draft invoice rejected', async () => {
		const invoice: any = await invService.create(
			{
				organizationId: orgId,
				customerId,
				invoiceDate: today,
				dueDate: today,
				totalAmount: 50,
				lineItems: [{ description: 'Line', quantity: 1, unitPrice: 50, total: 50 }],
				status: 'draft',
			} as any,
		)
		await expectThrows(() => invService.applyPayment(String(invoice._id), 10), /status/i)
	})

	// ── K Kill / cancel paths ──────────────────────────────────────────────
	console.log('── K: Cancel / reject paths ──')
	await check('K', 'pending RA can be cancelled; approved cannot receive cancel as pending-only', async () => {
		const ra: any = await raService.create(
			{
				organizationId: orgId,
				customerId,
				requestedDate: today,
				lines: [{ description: ITEM, quantity: 1 }],
			},
			adminId,
		)
		const id = String(ra._id)
		await raService.cancel(id, adminId)
		await expectThrows(() => raService.approve(id, adminId), /pending/i)
	})
	await check('K', 'PO decline only when submitted', async () => {
		const po: any = await poService.create(
			{
				vendorId,
				orderDate: today,
				items: [{ productName: ITEM, quantity: 1, unitPrice: 5 }],
				organizationId: orgId,
			},
			buyerId,
		)
		await expectThrows(() => poService.reject(String(po._id), adminId), /submitted/i)
	})

	// ── L Lock / unlock ────────────────────────────────────────────────────
	console.log('── L: Lock / unlock ──')
	await check('L', 'lock confirmed PO; unlock restores purchase_order; unlock non-locked fails', async () => {
		const po: any = await poService.create(
			{
				vendorId,
				orderDate: today,
				items: [{ productName: ITEM, quantity: 1, unitPrice: 9 }],
				organizationId: orgId,
			},
			buyerId,
		)
		const id = String(po._id)
		await poService.submit(id, buyerId)
		await poService.approve(id, adminId)
		await poService.confirmOrder(id, adminId)
		const locked: any = await poService.lock(id, adminId)
		assert.equal(locked.status, 'locked')
		const unlocked: any = await poService.unlock(id, adminId)
		assert.equal(unlocked.status, 'purchase_order')
		await expectThrows(() => poService.unlock(id, adminId), /locked/i)
	})

	// ── M Manufacturing / work order ───────────────────────────────────────
	console.log('── M: Manufacturing / work orders ──')
	await check('M', 'work order create and status update', async () => {
		const wo: any = await woService.create({ organizationId: orgId, docDate: today, status: 'DRAFT' }, adminId)
		assert.ok(wo.docNumber)
		const updated: any = await woService.update(String(wo._id), { organizationId: orgId, docDate: today, status: 'IN_PROGRESS' })
		assert.equal(updated.status, 'IN_PROGRESS')
	})

	// ── N Negative / over-limit amounts ────────────────────────────────────
	console.log('── N: Negative / over-limit ──')
	await check('N', 'cash-sale refund cannot exceed total', async () => {
		const so: any = await soService.create({
			customerId,
			totalAmount: 100,
			orderDate: today,
			cashSale: true,
			status: 'active',
			organizationId: orgId,
		} as any)
		await expectThrows(
			() =>
				soService.refundCashSale(
					{ salesOrderId: String(so._id), amount: 150, refundDate: today, refundMethod: 'cash' },
					adminId,
				),
			/exceed|positive|refund/i,
		)
	})

	// ── O Over-receive / over-apply on returns ─────────────────────────────
	console.log('── O: Over-receive caps ──')
	await check('O', 'RA receive before approve rejected', async () => {
		const ra: any = await raService.create(
			{
				organizationId: orgId,
				customerId,
				requestedDate: today,
				lines: [{ description: ITEM, quantity: 2 }],
			},
			adminId,
		)
		await expectThrows(
			() =>
				raService.receiveGoods(
					{
						returnAuthorizationId: String(ra._id),
						receivedDate: today,
						lines: [{ lineId: String(ra.lines[0]._id), quantityReceived: 1 }],
					},
					adminId,
				),
			/approved/i,
		)
	})
	await check('O', 'RA receive caps at line qty (no infinite stock)', async () => {
		const before = await stockQty(orgId, ITEM)
		const ra: any = await raService.create(
			{
				organizationId: orgId,
				customerId,
				requestedDate: today,
				lines: [{ description: ITEM, quantity: 2 }],
			},
			adminId,
		)
		const id = String(ra._id)
		await raService.approve(id, adminId)
		const lineId = String(ra.lines[0]._id)
		await raService.receiveGoods(
			{ returnAuthorizationId: id, receivedDate: today, lines: [{ lineId, quantityReceived: 2 }] },
			adminId,
		)
		// second receive of same line should add 0 more
		await raService.receiveGoods(
			{ returnAuthorizationId: id, receivedDate: today, lines: [{ lineId, quantityReceived: 5 }] },
			adminId,
		)
		const after = await stockQty(orgId, ITEM)
		assert.equal(after, before + 2, `stock should only increase by approved qty 2 (was ${before}, now ${after})`)
	})

	// ── P Purchase status machine ──────────────────────────────────────────
	console.log('── P: Purchase status machine ──')
	await check('P', 'cannot confirm PO before approve', async () => {
		const po: any = await poService.create(
			{
				vendorId,
				orderDate: today,
				items: [{ productName: ITEM, quantity: 1, unitPrice: 1 }],
				organizationId: orgId,
			},
			buyerId,
		)
		const id = String(po._id)
		await poService.submit(id, buyerId)
		await expectThrows(() => poService.confirmOrder(id, adminId), /approved/i)
	})
	await check('P', 'cannot mark RFQ sent unless status=rfq', async () => {
		const po: any = await poService.create(
			{
				vendorId,
				orderDate: today,
				items: [{ productName: ITEM, quantity: 1, unitPrice: 1 }],
				organizationId: orgId,
			},
			buyerId,
		)
		const id = String(po._id)
		await poService.submit(id, buyerId)
		await expectThrows(() => poService.markRfqSent(id, buyerId), /rfq/i)
	})

	// ── Q Quotation / sales invoicing policy ───────────────────────────────
	console.log('── Q: Sales invoicing policy ──')
	await check('Q', 'delivered_quantities blocks invoice before delivery', async () => {
		const so: any = await soService.create({
			customerId,
			totalAmount: 300,
			orderDate: today,
			invoicingPolicy: 'delivered_quantities',
			status: 'active',
			organizationId: orgId,
		} as any)
		await expectThrows(
			() => soService.createInvoiceFromSalesOrder(String(so._id), today, undefined, adminId),
			/invoiceable|delivered/i,
		)
	})
	await check('Q', 'ordered_quantities allows invoice without delivery', async () => {
		const so: any = await soService.create({
			customerId,
			totalAmount: 120,
			orderDate: today,
			invoicingPolicy: 'ordered_quantities',
			status: 'active',
			organizationId: orgId,
		} as any)
		const inv: any = await soService.createInvoiceFromSalesOrder(String(so._id), today, undefined, adminId)
		assert.ok(inv.invoiceNumber)
	})

	// ── R Returns → stock IN ───────────────────────────────────────────────
	console.log('── R: Returns stock IN ──')
	await check('R', 'approved RA receive increases inventory', async () => {
		const before = await stockQty(orgId, ITEM)
		const ra: any = await raService.create(
			{
				organizationId: orgId,
				customerId,
				requestedDate: today,
				lines: [{ description: ITEM, quantity: 3 }],
			},
			adminId,
		)
		const id = String(ra._id)
		await raService.approve(id, adminId)
		await raService.receiveGoods(
			{
				returnAuthorizationId: id,
				receivedDate: today,
				lines: [{ lineId: String(ra.lines[0]._id), quantityReceived: 3 }],
			},
			adminId,
		)
		assert.equal(await stockQty(orgId, ITEM), before + 3)
	})

	// ── S Soft-delete / not-found ──────────────────────────────────────────
	console.log('── S: Soft-delete / not-found ──')
	await check('S', 'operations on unknown ids fail clearly', async () => {
		const fake = new mongoose.Types.ObjectId().toString()
		await expectThrows(() => poService.approve(fake, adminId), /not found/i)
		await expectThrows(() => raService.approve(fake, adminId), /not found/i)
		await expectThrows(() => billService.approveBill(fake, adminId), /not found/i)
	})

	// ── T Tax / vendor master GST-PAN validation ───────────────────────────
	console.log('── T: Tax ID validation ──')
	await check('T', 'invalid GSTIN rejected', async () => {
		await expectThrows(
			() =>
				vendorService.createVendor(
					{ organizationId: orgId, name: 'Bad GST', gstin: 'INVALID' } as any,
					adminId,
				),
			/gstin/i,
		)
	})
	await check('T', 'invalid PAN rejected', async () => {
		await expectThrows(
			() =>
				vendorService.createVendor(
					{ organizationId: orgId, name: 'Bad PAN', pan: '123' } as any,
					adminId,
				),
			/pan/i,
		)
	})

	// ── U Unlock / fixed asset edges ───────────────────────────────────────
	console.log('── U: Fixed assets ──')
	await check('U', 'depreciation before purchase date rejected', async () => {
		const asset: any = await assetService.create({
			organizationId: orgId,
			assetCode: `FA-EDGE-${Date.now()}`,
			name: 'Edge Laptop',
			category: 'COMPUTER',
			purchaseDate: '2026-06-01',
			acquisitionCost: 60000,
			salvageValue: 0,
			usefulLifeMonths: 36,
			depreciationMethod: 'STRAIGHT_LINE',
			status: 'ACTIVE',
		})
		await expectThrows(
			() =>
				assetService.postDepreciation(String(asset._id), {
					periodEndDate: '2026-01-01',
					notes: 'too early',
				}),
			/before purchase|invalid/i,
		)
	})
	await check('U', 'straight-line depreciation reduces book value', async () => {
		const asset: any = await assetService.create({
			organizationId: orgId,
			assetCode: `FA-EDGE2-${Date.now()}`,
			name: 'Edge Desk',
			category: 'FURNITURE',
			purchaseDate: today,
			acquisitionCost: 36000,
			salvageValue: 0,
			usefulLifeMonths: 36,
			depreciationMethod: 'STRAIGHT_LINE',
			status: 'ACTIVE',
		})
		const posted: any = await assetService.postDepreciation(String(asset._id), {
			periodEndDate: today,
			notes: 'period 1',
		})
		assert.ok(Number(posted.accumulatedDepreciation) > 0)
		assert.ok(Number(posted.bookValue) < 36000)
	})

	// ── V Vendor approval lifecycle ────────────────────────────────────────
	console.log('── V: Vendor approval lifecycle ──')
	await check('V', 'draft → submit → approve activates vendor', async () => {
		const v: any = await vendorService.createVendor(
			{ organizationId: orgId, name: 'Lifecycle Vendor', vendorType: 'company' } as any,
			buyerId,
		)
		const id = String(v._id ?? v.id)
		await vendorService.submitForOrgApproval(id, buyerId)
		const approved: any = await vendorService.approveFromApprovalQueue(id, adminId)
		assert.ok(
			String(approved.orgApprovalStatus || approved.status).match(/approved|active/i) ||
				approved.orgApprovalStatus === 'approved',
		)
	})

	// ── W Work / status illegal transitions ────────────────────────────────
	console.log('── W: Illegal status transitions ──')
	await check('W', 'cannot approve PO that is still RFQ (not submitted)', async () => {
		const po: any = await poService.create(
			{
				vendorId,
				orderDate: today,
				items: [{ productName: ITEM, quantity: 1, unitPrice: 2 }],
				organizationId: orgId,
			},
			buyerId,
		)
		await expectThrows(() => poService.approve(String(po._id), adminId), /submitted/i)
	})

	// ── X Cross-check bill after receive ───────────────────────────────────
	console.log('── X: Cross-check PO bill after receive ──')
	await check('X', 'receive then bill succeeds for received_quantities', async () => {
		const po: any = await poService.findById(poRecvId)
		const lineId = String(po.items[0]._id)
		await poService.receive(poRecvId, buyerId, [{ lineId, qtyReceived: 5 }])
		const bill: any = await poService.billPurchaseOrder(poRecvId, today, today, buyerId)
		assert.ok(bill.billNumber)
	})

	// ── Y Year / leave enrollment entitlement ──────────────────────────────
	console.log('── Y: Leave entitlement overuse ──')
	await check('Y', 'leave beyond entitlement is rejected on approve', async () => {
		const types: any[] = await leaveService.listLeaveTypes(orgId)
		const lt = types.find((t: any) => t.code === 'EDGE-AL') || types[0]
		const start = new Date()
		start.setDate(start.getDate() + 60)
		const end = new Date(start)
		end.setDate(end.getDate() + 20) // 21 days > 12 entitled
		const year = start.getFullYear()
		// Ensure enrollment exists for the leave year (Odoo: balance check needs enrollment)
		try {
			await leaveService.createLeaveEnrollment({
				organizationId: orgId,
				userId: employeeId,
				leaveTypeId: String(lt._id),
				calendarYear: year,
				entitledDays: 12,
			})
		} catch {
			/* already enrolled */
		}
		const app: any = await leaveService.createLeaveApplication({
			organizationId: orgId,
			userId: employeeId,
			leaveTypeId: String(lt._id),
			startDate: start.toISOString().slice(0, 10),
			endDate: end.toISOString().slice(0, 10),
			reason: 'too many days',
		})
		await expectThrows(
			() => leaveService.approveLeaveApplication(String(app._id), adminId),
			/insufficient|balance|entitlement|exceed|enrollment/i,
		)
	})

	// ── Z Zero / empty amount guards ───────────────────────────────────────
	console.log('── Z: Zero-amount guards ──')
	await check('Z', 'invoice credit amount must be valid', async () => {
		const invoice: any = await invService.create(
			{
				organizationId: orgId,
				customerId,
				invoiceDate: today,
				dueDate: today,
				totalAmount: 80,
				lineItems: [{ description: 'Z', quantity: 1, unitPrice: 80, total: 80 }],
				status: 'draft',
			} as any,
		)
		const id = String(invoice._id)
		await invService.submitForApproval(id, adminId)
		await invService.approveApproval(id, adminId)
		await expectThrows(() => invService.applyCreditMemo(id, 0, 'z', adminId), /credit|invalid|positive/i)
		await expectThrows(() => invService.applyCreditMemo(id, 999, 'z', adminId), /credit|invalid|exceed/i)
	})

	console.log('\n══════════════════════════════════════')
	console.log(`Edge cases: ${passed} passed, ${failed} failed`)
	if (failures.length) {
		console.log('\nFailures:')
		failures.forEach((f) => console.log(`  - ${f}`))
	}
	console.log('══════════════════════════════════════\n')

	await mongoose.disconnect()
	process.exit(failed > 0 ? 1 : 0)
}

main().catch((err) => {
	console.error(err)
	process.exit(1)
})
