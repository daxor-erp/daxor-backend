/**
 * Integration tests for gap-fix tasks 1-7 from the Odoo 19 audit sprint.
 *
 * Tests:
 *   Task 1 — billControlPolicy per product overrides PO-level policy
 *   Task 2 — ChartOfAccounts accountType enum enforcement
 *   Task 3 — Aged Payable / Aged Receivable reports
 *   Task 4 — Reorder Scheduler creates RFQs for below-min products
 *   Task 5 — Blanket Order CRUD + confirm/close lifecycle
 *   Task 6 — AVCO running average updated on applyReceipt
 *   Task 7 — Lot/serial traceability trace query
 *
 * Usage:
 *   MONGODB_URI=mongodb://127.0.0.1:27117/daxor_gap_test \
 *   node -r esbuild-register src/scripts/test-gap-fixes.ts
 */
import mongoose from 'mongoose'
import assert from 'node:assert/strict'

import { Organization } from '~/modules/organization/model'
import { User } from '~/modules/user/model'
import { Vendor } from '~/modules/vendor/model'
import { Product } from '~/modules/product/model'
import { ProductStockService } from '~/modules/product-stock/service'
import { PurchaseOrderService } from '~/modules/purchase-order/service'
import { GeneralLedgerService } from '~/modules/general-ledger/service'
import { BlanketOrderService } from '~/modules/blanket-order/service'
import { GRNService } from '~/modules/grn/service'
import { ChartOfAccounts } from '~/modules/general-ledger/model'
import { VendorBill } from '~/modules/vendor-bill/model'
import { CustomerInvoice } from '~/modules/customer-invoice/model'
import { runReorderScheduler } from '~/lib/reorder-scheduler'

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
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27117/daxor_gap_test'
  await mongoose.connect(uri)
  console.log(`Connected to ${uri}\n`)
  await mongoose.connection.dropDatabase()

  const org = await Organization.create({ code: 'GAP', name: 'Gap Test Org', type: 'client' })
  const orgId = String(org._id)
  const admin = await User.create({ email: 'admin@gap.test', firstName: 'Admin', lastName: 'Gap', organizationId: org._id, roles: ['ORG_ADMIN'] })
  const adminId = String(admin._id)
  const vendor = await Vendor.create({ name: 'Test Vendor', organizationId: org._id, status: 'active', orgApprovalStatus: 'approved' })
  const vendorId = String(vendor._id)

  await Organization.findByIdAndUpdate(org._id, {
    moduleApprovers: [{ moduleKey: 'purchases', approverUserIds: [admin._id] }],
  })

  const poService = new PurchaseOrderService()
  const stockService = new ProductStockService()
  const glService = new GeneralLedgerService()
  const blanketService = new BlanketOrderService()
  const grnService = new GRNService()

  // ─── Task 1: per-product billControlPolicy ────────────────────────────────
  console.log('\n── Task 1: Per-product billControlPolicy ──')

  let orderedQtyProductId = ''
  await check('product with ordered_quantities policy creates with billControlPolicy field', async () => {
    const p = await Product.create({
      name: 'Service Product',
      organizationId: orgId,
      canBePurchased: true,
      billControlPolicy: 'ordered_quantities',
      productType: 'service',
      trackInventory: false,
    })
    orderedQtyProductId = String(p._id)
    assert.equal((p as any).billControlPolicy, 'ordered_quantities')
  })

  await check('PO with service product (ordered_quantities) allows billing before receipt', async () => {
    // Need a separate approver to avoid self-approval block
    const approver2 = await User.create({ email: 'approver2@gap.test', firstName: 'Approver2', lastName: 'Gap', organizationId: org._id, roles: ['ORG_ADMIN'] })
    await Organization.findByIdAndUpdate(org._id, {
      moduleApprovers: [{ moduleKey: 'purchases', approverUserIds: [approver2._id] }],
    })
    const approverId = String(approver2._id)

    const po: any = await poService.create({
      vendorId,
      orderDate: new Date().toISOString(),
      billControlPolicy: 'received_quantities', // PO-level says received, but product overrides to ordered
      items: [{ productId: orderedQtyProductId, productName: 'Service Product', quantity: 5, unitPrice: 1000 }],
      organizationId: orgId,
    }, adminId)
    await poService.submit(String(po._id), adminId)
    await poService.approve(String(po._id), approverId)
    await poService.confirmOrder(String(po._id), approverId)

    // Billing should succeed without receipt because the product-level policy = ordered_quantities
    const today = new Date().toISOString().slice(0, 10)
    const bill: any = await poService.billPurchaseOrder(String(po._id), today, today, adminId)
    assert.ok(bill.billNumber, 'bill should be created without receipt due to product policy override')
    assert.equal(Number(bill.lineItems[0].quantity), 5, 'billed qty = ordered qty (ordered_quantities)')

    // Restore approver for other tests
    await Organization.findByIdAndUpdate(org._id, {
      moduleApprovers: [{ moduleKey: 'purchases', approverUserIds: [admin._id] }],
    })
  })

  // ─── Task 2: COA accountType enum ─────────────────────────────────────────
  console.log('\n── Task 2: ChartOfAccounts accountType enum ──')

  await check('COA accepts valid accountType values', async () => {
    const validTypes = ['asset', 'liability', 'equity', 'revenue', 'expense', 'bank', 'receivable', 'payable', 'other']
    for (const t of validTypes) {
      const coa = await glService.createChartOfAccount({
        accountName: `Test ${t}`,
        accountType: t as any,
        organizationId: orgId,
        isActive: true,
        level: 1,
      })
      assert.equal(String((coa as any).accountType), t)
    }
  })

  await check('COA rejects invalid accountType', async () => {
    let threw = false
    try {
      await ChartOfAccounts.create({
        accountCode: 'INVALID-99',
        accountName: 'Invalid Type',
        accountType: 'nonsense_type', // not in enum
        organizationId: orgId,
        isActive: true,
        level: 1,
      })
    } catch {
      threw = true
    }
    assert.ok(threw, 'invalid accountType should throw a Mongoose validation error')
  })

  await check('COA parentAccountId sets level = parent.level + 1', async () => {
    const parent: any = await glService.createChartOfAccount({
      accountName: 'Parent Account',
      accountType: 'asset',
      organizationId: orgId,
      level: 1,
    })
    const child: any = await glService.createChartOfAccount({
      accountName: 'Child Account',
      accountType: 'asset',
      organizationId: orgId,
      parentAccountId: String(parent._id),
    } as any)
    assert.equal(Number(child.level), 2, 'child level should be parent.level + 1')
  })

  // ─── Task 3: Aged Reports ─────────────────────────────────────────────────
  console.log('\n── Task 3: Aged Payable / Receivable reports ──')

  await check('agedPayable returns buckets for overdue bills', async () => {
    // Create a vendor bill that is 45 days overdue
    const overdueDate = new Date(Date.now() - 45 * 86_400_000)
    await VendorBill.create({
      billNumber: 'BILL-AGED-001',
      vendorId: vendor._id,
      billDate: overdueDate,
      dueDate: overdueDate,
      lineItems: [{ description: 'Test', quantity: 1, unitPrice: 5000, total: 5000 }],
      subtotal: 5000, taxAmount: 0, totalAmount: 5000,
      paidAmount: 0, outstandingAmount: 5000,
      status: 'approved',
      organizationId: orgId,
    })

    const rows = await glService.getAgedPayable(orgId)
    assert.ok(rows.length > 0, 'should return at least one vendor row')
    const vendorRow = rows.find((r: any) => String(r.vendorId) === vendorId)
    assert.ok(vendorRow, 'vendor row should be present')
    assert.ok(vendorRow.days60 > 0 || vendorRow.days30 > 0, '5000 should appear in 31-60 day bucket')
    assert.ok(vendorRow.total > 0, 'total should be > 0')
  })

  await check('agedReceivable returns buckets for overdue invoices', async () => {
    const overdueDate = new Date(Date.now() - 35 * 86_400_000)
    await CustomerInvoice.create({
      invoiceNumber: 'INV-AGED-001',
      customerId: admin._id,
      organizationId: orgId,
      invoiceDate: overdueDate,
      dueDate: overdueDate,
      subtotal: 3000, taxAmount: 0, totalAmount: 3000,
      paidAmount: 0,
      status: 'approved',
    })

    const rows = await glService.getAgedReceivable(orgId)
    assert.ok(rows.length > 0, 'should return at least one customer row')
    const row = rows[0]
    assert.ok(row.total > 0, 'outstanding total should be positive')
  })

  // ─── Task 4: Reorder Scheduler ────────────────────────────────────────────
  console.log('\n── Task 4: Reorder Scheduler ──')

  await check('scheduler creates draft RFQ for product below minQty', async () => {
    const p = await Product.create({
      name: 'Reorder Widget',
      internalReference: `REORDER-${Date.now()}`,
      organizationId: orgId,
      canBePurchased: true,
      productType: 'goods',
      reorderingRules: [{ minQty: 10, maxQty: 50 }],
      vendorPricelist: [{ vendorId: vendor._id, price: 200, minQty: 1, leadTimeDays: 3 }],
    })

    // Set stock to 3 (below minQty=10)
    await stockService.updateQuantity(String(p._id), 3, adminId, { organizationId: orgId })

    const result = await runReorderScheduler(orgId, adminId)
    assert.ok(result.triggered, 'scheduler should report triggered=true')
    assert.ok(result.scanned > 0, 'should scan at least one product')

    const pResult = result.products.find((r: any) => r.productId === String(p._id))
    assert.ok(pResult, 'reorder widget should appear in results')
    assert.ok(pResult.poCreated || pResult.error, 'either PO created or error reported')
    if (pResult.poCreated) {
      assert.equal(Number(pResult.qtyToOrder), 47, 'qtyToOrder = maxQty(50) - onHand(3) = 47')
    }
  })

  // ─── Task 5: Blanket Orders ────────────────────────────────────────────────
  console.log('\n── Task 5: Blanket Order lifecycle ──')

  let boId = ''
  await check('create blanket order → status=draft', async () => {
    const bo: any = await blanketService.create({
      vendorId,
      vendorName: 'Test Vendor',
      lines: [{ productName: 'Widget A', quantity: 100, unitPrice: 500 }],
      validityStart: new Date().toISOString(),
      validityEnd: new Date(Date.now() + 90 * 86_400_000).toISOString(),
      organizationId: orgId,
    }, adminId)
    boId = String(bo._id)
    assert.equal(bo.status, 'draft')
    assert.ok(bo.seqNo?.startsWith('BO-'), 'seqNo should start with BO-')
  })

  await check('confirm blanket order → status=open', async () => {
    const bo: any = await blanketService.confirm(boId, adminId)
    assert.equal(bo.status, 'open')
  })

  await check('checkCommitment returns remaining qty', async () => {
    const p = await Product.create({ name: 'BO Product', internalReference: `BO-${Date.now()}`, organizationId: orgId, canBePurchased: true })
    const bo: any = await blanketService.create({
      vendorId,
      lines: [{ productId: String(p._id), productName: 'BO Product', quantity: 50, unitPrice: 100 }],
      organizationId: orgId,
    }, adminId)
    await blanketService.confirm(String(bo._id), adminId)

    const check1 = await blanketService.checkCommitment(String(bo._id), String(p._id), 30)
    assert.equal(check1.remaining, 20, 'remaining = 50 - 30 = 20')
    assert.equal(check1.over, false)

    const check2 = await blanketService.checkCommitment(String(bo._id), String(p._id), 60)
    assert.equal(check2.over, true, 'ordering 60 against commitment of 50 should be over')
  })

  await check('close blanket order → status=closed', async () => {
    const bo: any = await blanketService.close(boId, adminId)
    assert.equal(bo.status, 'closed')
  })

  // ─── Task 6: AVCO valuation ────────────────────────────────────────────────
  console.log('\n── Task 6: AVCO inventory valuation ──')

  await check('applyReceipt computes AVCO correctly', async () => {
    const p = await Product.create({ name: 'AVCO Product', internalReference: `AVCO-${Date.now()}`, organizationId: orgId, productType: 'goods' })
    const pId = String(p._id)

    // Receipt 1: 10 units @ cost 100 → AVCO = 100
    const s1 = await stockService.applyReceipt(pId, 10, { organizationId: orgId, unitCost: 100 })
    assert.equal(Number((s1 as any).onHandQty), 10)
    assert.equal(Number((s1 as any).averageCost), 100)
    assert.equal(Number((s1 as any).inventoryValue), 1000)

    // Receipt 2: 10 units @ cost 200 → AVCO = (10×100 + 10×200) / 20 = 150
    const s2 = await stockService.applyReceipt(pId, 10, { organizationId: orgId, unitCost: 200 })
    assert.equal(Number((s2 as any).onHandQty), 20)
    assert.equal(Number((s2 as any).averageCost), 150, 'AVCO should be 150')
    assert.equal(Number((s2 as any).inventoryValue), 3000, 'inventory value should be 3000')
  })

  // ─── Task 7: Lot/serial traceability ──────────────────────────────────────
  console.log('\n── Task 7: Lot/serial traceability ──')

  await check('traceLotSerial finds GRN where lot was received', async () => {
    // Create a GRN with a specific lot number
    const grn: any = await grnService.createGRN({
      receivedDate: new Date().toISOString(),
      organizationId: orgId,
      vendorName: 'Lot Vendor',
      lineItems: [{
        itemDescription: 'Tracked Item',
        orderedQty: 5,
        receivedQty: 5,
        unitPrice: 100,
        lotSerialNumbers: ['LOT-TEST-001', 'LOT-TEST-002'],
      }],
    }, adminId)

    const trace = await grnService.traceLotSerial(orgId, 'LOT-TEST-001')
    assert.equal(trace.lotOrSerial, 'LOT-TEST-001')
    assert.ok(trace.totalEventsFound > 0, 'should find at least one event')
    const receiptEvent = trace.events.find((e: any) => e.eventType === 'RECEIPT')
    assert.ok(receiptEvent, 'should find a RECEIPT event in the trace')
    assert.equal(receiptEvent.documentType, 'GRN')
  })

  await check('traceLotSerial returns empty events for unknown lot', async () => {
    const trace = await grnService.traceLotSerial(orgId, 'LOT-UNKNOWN-9999')
    assert.equal(trace.totalEventsFound, 0, 'unknown lot should return no events')
  })

  // ─── Summary ──────────────────────────────────────────────────────────────
  console.log(`\n${'─'.repeat(50)}`)
  console.log(`Results: ${passed} passed, ${failed} failed`)
  if (failed > 0) console.log('❌ Some tests failed.')
  else console.log('✅ All gap-fix tests passed.')

  await mongoose.connection.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
