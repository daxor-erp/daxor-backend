/**
 * Integration tests for ERP flows implemented in the Odoo-alignment sprint.
 * Covers:
 *   Flow 01 — PO: billControlPolicy, lock/unlock
 *   Flow 04 — Inventory: stock deduction on delivery, stock-adjustment confirm, stock-transfer confirm
 *   Flow 05 — Sales: invoicingPolicy (delivered_quantities) enforcement
 *   Flow 07 — Returns: receiveGoods → inventory IN
 *
 * Usage:
 *   MONGODB_URI=mongodb://127.0.0.1:27117/daxor_erp_test \
 *   node -r esbuild-register src/scripts/test-erp-flows.ts
 */
import mongoose from 'mongoose'
import assert from 'node:assert/strict'

import { Organization } from '~/modules/organization/model'
import { User } from '~/modules/user/model'
import { Vendor } from '~/modules/vendor/model'
import { PurchaseOrderService } from '~/modules/purchase-order/service'
import { DeliveryOrderService } from '~/modules/delivery-order/service'
import { SalesOrderService } from '~/modules/sales-order/service'
import { StockAdjustmentService } from '~/modules/stock-adjustment/service'
import { StockTransferService } from '~/modules/stock-transfer/service'
import { ReturnAuthorizationService } from '~/modules/return-authorization/service'
import { InventoryControlService } from '~/modules/inventory-control/service'
import { VendorBillService } from '~/modules/vendor-bill/service'
import { InventoryControl } from '~/modules/inventory-control/model'

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

// ─── helpers ────────────────────────────────────────────────────────────────

/**
 * Sum qty across all inventory-control records for a given itemName in the MAIN bin.
 * Uses itemName field stored directly on InventoryControl — avoids dynamic module imports.
 */
async function getStockQty(orgId: string, itemName: string): Promise<number> {
  const records = await InventoryControl.find({
    organizationId: orgId,
    itemName,
    binLocation: 'MAIN',
    isDeleted: false,
  }).lean()
  return records.reduce((sum: number, r: any) => sum + Number(r.quantity ?? 0), 0)
}

async function getStockQtyBin(orgId: string, itemName: string, bin: string): Promise<number> {
  const records = await InventoryControl.find({
    organizationId: orgId,
    itemName,
    binLocation: bin,
    isDeleted: false,
  }).lean()
  return records.reduce((sum: number, r: any) => sum + Number(r.quantity ?? 0), 0)
}

// ─── main ────────────────────────────────────────────────────────────────────

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27117/daxor_erp_test'
  await mongoose.connect(uri)
  console.log(`Connected to ${uri}\n`)
  await mongoose.connection.dropDatabase()

  // ── seed ──────────────────────────────────────────────────────────────────
  const org = await Organization.create({ code: 'ERP', name: 'ERP Flow Test Org', type: 'client' })
  const orgId = String(org._id)

  const admin = await User.create({ email: 'admin@test.local', firstName: 'Admin', lastName: 'User', organizationId: org._id, roles: ['ORG_ADMIN'] })
  const buyer = await User.create({ email: 'buyer@test.local', firstName: 'Buyer', lastName: 'User', organizationId: org._id, roles: ['PURCHASE_MANAGER'] })
  await Organization.findByIdAndUpdate(org._id, {
    moduleApprovers: [
      { moduleKey: 'purchases', approverUserIds: [admin._id] },
      { moduleKey: 'sales',     approverUserIds: [admin._id] },
    ],
  })

  const vendor = await Vendor.create({ name: 'Test Vendor', organizationId: org._id, status: 'active', orgApprovalStatus: 'approved' })
  const vendorId = String(vendor._id)

  const poService   = new PurchaseOrderService()
  const doService   = new DeliveryOrderService()
  const soService   = new SalesOrderService()
  const saService   = new StockAdjustmentService()
  const stService   = new StockTransferService()
  const raService   = new ReturnAuthorizationService()
  const invService  = new InventoryControlService()
  const billService = new VendorBillService()

  const adminId = String(admin._id)
  const buyerId = String(buyer._id)

  // Pre-seed some stock for delivery tests
  const ITEM_NAME = 'Test Widget'
  await invService.applyReceiptLines({
    organizationId: orgId,
    userId: adminId,
    referenceModule: 'seed',
    referenceId: 'seed-001',
    warehouseId: 'warehouse-main',
    warehouseName: 'MAIN',
    lines: [{ itemDescription: ITEM_NAME, quantity: 100 }],
    direction: 'in',
  })

  // ─────────────────────────────────────────────────────────────────────────
  // FLOW 01 — Purchase Order: billControlPolicy + lock/unlock
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n── Flow 01: Purchase Order ──')

  let po1Id = ''
  await check('PO: received_quantities policy blocks billing before receipt', async () => {
    const po: any = await poService.create({
      vendorId,
      orderDate: new Date().toISOString(),
      billControlPolicy: 'received_quantities',
      items: [{ productName: 'Widget', quantity: 10, unitPrice: 100 }],
      organizationId: orgId,
    }, buyerId)
    po1Id = String(po._id)
    await poService.submit(po1Id, buyerId)
    await poService.approve(po1Id, adminId)
    await poService.confirmOrder(po1Id, adminId)

    const today = new Date().toISOString().slice(0, 10)
    let threw = false
    try {
      await poService.billPurchaseOrder(po1Id, today, today, buyerId)
    } catch (err: any) {
      threw = true
      assert.ok(
        String(err.message).toLowerCase().includes('received'),
        `error should mention 'received', got: ${err.message}`,
      )
    }
    assert.ok(threw, 'expected billing before receipt to be blocked')
  })

  await check('PO: received_quantities policy allows billing after receipt', async () => {
    const po: any = await poService.findById(po1Id)
    const lineId = String(po.items[0]._id)
    await poService.receive(po1Id, buyerId, [{ lineId, qtyReceived: 10 }])
    const today = new Date().toISOString().slice(0, 10)
    const bill: any = await poService.billPurchaseOrder(po1Id, today, today, buyerId)
    assert.ok(bill.billNumber, 'bill should be created after receipt')
  })

  let po2Id = ''
  await check('PO: ordered_quantities policy allows billing before receipt (service invoicing)', async () => {
    const po: any = await poService.create({
      vendorId,
      orderDate: new Date().toISOString(),
      billControlPolicy: 'ordered_quantities',
      items: [{ productName: 'Consulting Service', quantity: 1, unitPrice: 5000 }],
      organizationId: orgId,
    }, buyerId)
    po2Id = String(po._id)
    await poService.submit(po2Id, buyerId)
    await poService.approve(po2Id, adminId)
    await poService.confirmOrder(po2Id, adminId)

    // No receipt — bill should work immediately with ordered_quantities
    const today = new Date().toISOString().slice(0, 10)
    const bill: any = await poService.billPurchaseOrder(po2Id, today, today, buyerId)
    assert.ok(bill.billNumber, 'bill should be created without receipt for ordered_quantities')
    assert.equal(bill.lineItems[0].quantity, 1, 'billed qty = ordered qty')
    assert.equal(bill.lineItems[0].total, 5000, 'billed total = 5000')
  })

  let po3Id = ''
  await check('PO: lock → status = locked', async () => {
    const po: any = await poService.create({
      vendorId,
      orderDate: new Date().toISOString(),
      items: [{ productName: 'Widget', quantity: 2, unitPrice: 50 }],
      organizationId: orgId,
    }, buyerId)
    po3Id = String(po._id)
    await poService.submit(po3Id, buyerId)
    await poService.approve(po3Id, adminId)
    await poService.confirmOrder(po3Id, adminId)
    const locked: any = await poService.lock(po3Id, adminId)
    assert.equal(locked.status, 'locked')
  })

  await check('PO: unlock → status = purchase_order (editable again)', async () => {
    const unlocked: any = await poService.unlock(po3Id, adminId)
    assert.equal(unlocked.status, 'purchase_order', 'unlocked PO should return to purchase_order')
  })

  await check('PO: cannot unlock a non-locked PO', async () => {
    let threw = false
    try {
      await poService.unlock(po1Id, adminId) // po1Id is 'billed', not 'locked'
    } catch {
      threw = true
    }
    assert.ok(threw, 'expected error when unlocking a non-locked PO')
  })

  // ─────────────────────────────────────────────────────────────────────────
  // FLOW 04 — Inventory
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n── Flow 04: Inventory ──')

  await check('Inventory: stock-adjustment confirm decreases stock', async () => {
    const before = await getStockQty(orgId, ITEM_NAME)

    const sa: any = await saService.create({
      adjDate: new Date().toISOString(),
      adjustmentType: 'decrease',
      warehouseName: 'MAIN',
      lineItems: [{ itemDescription: ITEM_NAME, currentQty: before, adjustedQty: before - 5, difference: -5 }],
      organizationId: orgId,
    }, adminId)

    await saService.confirm(String(sa._id), adminId)
    const after = await getStockQty(orgId, ITEM_NAME)
    assert.equal(after, before - 5, `stock should decrease by 5 (was ${before}, now ${after})`)
  })

  await check('Inventory: stock-adjustment confirm increases stock', async () => {
    const before = await getStockQty(orgId, ITEM_NAME)

    const sa: any = await saService.create({
      adjDate: new Date().toISOString(),
      adjustmentType: 'increase',
      warehouseName: 'MAIN',
      lineItems: [{ itemDescription: ITEM_NAME, currentQty: before, adjustedQty: before + 10, difference: 10 }],
      organizationId: orgId,
    }, adminId)

    await saService.confirm(String(sa._id), adminId)
    const after = await getStockQty(orgId, ITEM_NAME)
    assert.equal(after, before + 10, `stock should increase by 10 (was ${before}, now ${after})`)
  })

  await check('Inventory: stock-transfer confirm moves qty between locations', async () => {
    const beforeMain = await getStockQty(orgId, ITEM_NAME)

    const st: any = await stService.create({
      transferDate: new Date().toISOString(),
      fromWarehouseName: 'MAIN',
      toWarehouseName: 'SECONDARY',
      lineItems: [{ itemDescription: ITEM_NAME, qty: 15, unit: 'EA' }],
      organizationId: orgId,
    }, adminId)

    await stService.confirm(String(st._id), adminId)

    const afterMain = await getStockQty(orgId, ITEM_NAME)
    // Stock at MAIN should decrease; SECONDARY should have appeared.
    assert.equal(afterMain, beforeMain - 15, `MAIN stock should decrease by 15 (was ${beforeMain}, now ${afterMain})`)

    // Check SECONDARY bin using itemName field (avoids dynamic module import resolution issues)
    const secQty = await getStockQtyBin(orgId, ITEM_NAME, 'SECONDARY')
    assert.ok(secQty > 0, 'SECONDARY bin should have stock after transfer')
    assert.equal(secQty, 15, 'SECONDARY should have exactly 15 units')
  })

  await check('Inventory: delivery-order DISPATCHED deducts stock', async () => {
    const before = await getStockQty(orgId, ITEM_NAME)

    const suffix = Date.now()
    const do_: any = await doService.create({
      organizationId: orgId,
      docNumber: `DO-TEST-${suffix}`,
      deliveryDate: new Date().toISOString(),
      items: [{ itemName: ITEM_NAME, quantity: 5 }],
    })

    await doService.transitionStatus(String(do_._id), 'DISPATCHED', undefined, adminId)

    const after = await getStockQty(orgId, ITEM_NAME)
    assert.equal(after, before - 5, `stock should decrease by 5 on dispatch (was ${before}, now ${after})`)
  })

  await check('Inventory: delivery-order DELIVERED does not double-deduct stock', async () => {
    const before = await getStockQty(orgId, ITEM_NAME)

    const suffix = Date.now()
    const do_: any = await doService.create({
      organizationId: orgId,
      docNumber: `DO-DEL-${suffix}`,
      deliveryDate: new Date().toISOString(),
      items: [{ itemName: ITEM_NAME, quantity: 3 }],
    })
    const doId = String(do_._id)

    await doService.transitionStatus(doId, 'DISPATCHED', undefined, adminId)
    const afterDispatch = await getStockQty(orgId, ITEM_NAME)
    assert.equal(afterDispatch, before - 3, 'stock deducted on DISPATCHED')

    // DELIVERED should NOT deduct again
    await doService.transitionStatus(doId, 'DELIVERED', 'John Smith', adminId)
    const afterDelivered = await getStockQty(orgId, ITEM_NAME)
    assert.equal(afterDelivered, before - 3, 'DELIVERED must not double-deduct stock')
  })

  // ─────────────────────────────────────────────────────────────────────────
  // FLOW 05 — Sales: invoicingPolicy
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n── Flow 05: Sales Invoicing Policy ──')

  let so1Id = ''
  await check('Sales: ordered_quantities policy allows invoice without delivery', async () => {
    const so: any = await soService.create({
      customerId: String(admin._id),
      totalAmount: 500,
      orderDate: new Date().toISOString(),
      invoicingPolicy: 'ordered_quantities',
      status: 'active',
      organizationId: orgId,
    })
    so1Id = String(so._id)
    // Should create invoice without any delivery
    const inv: any = await soService.createInvoiceFromSalesOrder(
      so1Id,
      new Date().toISOString(),
      undefined,
      adminId,
    )
    assert.ok(inv.invoiceNumber, 'invoice should be created for ordered_quantities SO')
    assert.equal(Number(inv.totalAmount), 500)
  })

  let so2Id = ''
  await check('Sales: delivered_quantities policy blocks invoice before delivery', async () => {
    const so: any = await soService.create({
      customerId: String(admin._id),
      totalAmount: 800,
      orderDate: new Date().toISOString(),
      invoicingPolicy: 'delivered_quantities',
      status: 'active',
      organizationId: orgId,
    })
    so2Id = String(so._id)

    let threw = false
    try {
      await soService.createInvoiceFromSalesOrder(so2Id, new Date().toISOString(), undefined, adminId)
    } catch (err: any) {
      threw = true
      // Odoo's exact error text
      assert.ok(
        String(err.message).includes('invoiceable line') || String(err.message).includes('delivered'),
        `error should mention 'invoiceable line' or 'delivered', got: ${err.message}`,
      )
    }
    assert.ok(threw, 'expected invoice creation to be blocked before delivery')
  })

  await check('Sales: delivered_quantities policy allows invoice after delivery dispatched', async () => {
    // Simulate a delivery dispatch that increments deliveredQuantity on the SO
    const suffix = Date.now()
    const deliveryDoc: any = await doService.create({
      organizationId: orgId,
      docNumber: `DO-SO-${suffix}`,
      salesOrderId: so2Id,
      deliveryDate: new Date().toISOString(),
      items: [{ itemName: ITEM_NAME, quantity: 2 }],
    })
    await doService.transitionStatus(String(deliveryDoc._id), 'DISPATCHED', undefined, adminId)

    // deliveredQuantity on the SO should now be > 0
    const so: any = await soService.findById(so2Id)
    assert.ok(
      Number(so.deliveredQuantity) > 0,
      `SO.deliveredQuantity should be > 0 after dispatch, got ${so.deliveredQuantity}`,
    )

    // Invoice should now be allowed
    const inv: any = await soService.createInvoiceFromSalesOrder(so2Id, new Date().toISOString(), undefined, adminId)
    assert.ok(inv.invoiceNumber, 'invoice should be created after delivery')
  })

  // ─────────────────────────────────────────────────────────────────────────
  // FLOW 07 — Returns: receiveGoods → stock IN
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n── Flow 07: Returns & Credit Notes ──')

  await check('Returns: receiveGoods on approved RA adds stock back to inventory', async () => {
    const before = await getStockQty(orgId, ITEM_NAME)

    // Create and approve a return authorization
    const ra: any = await raService.create({
      organizationId: orgId,
      customerId: String(admin._id),
      requestedDate: new Date().toISOString(),
      lines: [{ description: ITEM_NAME, quantity: 4 }],
    }, adminId)
    const raId = String(ra._id)

    await raService.approve(raId, adminId)

    const lineId = String(ra.lines[0]._id)
    await raService.receiveGoods(
      {
        returnAuthorizationId: raId,
        receivedDate: new Date().toISOString(),
        notes: 'Goods received back from customer',
        lines: [{ lineId, quantityReceived: 4 }],
      },
      adminId,
    )

    const after = await getStockQty(orgId, ITEM_NAME)
    assert.equal(after, before + 4, `stock should increase by 4 on RA goods receipt (was ${before}, now ${after})`)
  })

  await check('Returns: receiveGoods sets receiptComplete=true when all lines received', async () => {
    const ra: any = await raService.create({
      organizationId: orgId,
      customerId: String(admin._id),
      requestedDate: new Date().toISOString(),
      lines: [
        { description: 'Product A', quantity: 2 },
        { description: 'Product B', quantity: 3 },
      ],
    }, adminId)
    const raId = String(ra._id)
    await raService.approve(raId, adminId)

    const lineAId = String(ra.lines[0]._id)
    const lineBId = String(ra.lines[1]._id)

    // Partial receipt first
    await raService.receiveGoods({
      returnAuthorizationId: raId,
      receivedDate: new Date().toISOString(),
      lines: [{ lineId: lineAId, quantityReceived: 2 }],
    }, adminId)
    const partial: any = await raService.getById(raId)
    assert.equal(partial.receiptComplete, false, 'receiptComplete should be false after partial receipt')

    // Complete the receipt
    await raService.receiveGoods({
      returnAuthorizationId: raId,
      receivedDate: new Date().toISOString(),
      lines: [{ lineId: lineBId, quantityReceived: 3 }],
    }, adminId)
    const complete: any = await raService.getById(raId)
    assert.equal(complete.receiptComplete, true, 'receiptComplete should be true after all lines received')
  })

  await check('Returns: receiveGoods on pending RA throws (must be approved first)', async () => {
    const ra: any = await raService.create({
      organizationId: orgId,
      customerId: String(admin._id),
      requestedDate: new Date().toISOString(),
      lines: [{ description: 'Product X', quantity: 1 }],
    }, adminId)
    const raId = String(ra._id)
    // Do NOT approve — status remains 'pending'
    let threw = false
    try {
      await raService.receiveGoods({
        returnAuthorizationId: raId,
        receivedDate: new Date().toISOString(),
        lines: [{ lineId: String(ra.lines[0]._id), quantityReceived: 1 }],
      }, adminId)
    } catch (err: any) {
      threw = true
      assert.ok(String(err.message).toLowerCase().includes('approved'), `expected 'approved' in error, got: ${err.message}`)
    }
    assert.ok(threw, 'expected error when receiving goods on pending RA')
  })

  // ─────────────────────────────────────────────────────────────────────────
  // Summary
  // ─────────────────────────────────────────────────────────────────────────
  console.log(`\n${'─'.repeat(50)}`)
  console.log(`Results: ${passed} passed, ${failed} failed`)
  if (failed > 0) console.log('❌ Some tests failed — see errors above.')
  else console.log('✅ All tests passed.')

  await mongoose.connection.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error('Fatal error running ERP flow tests:', err)
  process.exit(1)
})
