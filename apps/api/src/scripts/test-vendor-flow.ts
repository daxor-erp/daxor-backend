/**
 * Standalone integration test for the Vendor overhaul (Phase 1).
 * Runs against a local, disposable MongoDB instance (never the shared Atlas cluster).
 *
 * Usage: MONGODB_URI=mongodb://127.0.0.1:27117/daxor_vendor_test node -r esbuild-register src/scripts/test-vendor-flow.ts
 */
import mongoose from 'mongoose'
import assert from 'node:assert/strict'

import { Organization } from '~/modules/organization/model'
import { User } from '~/modules/user/model'
import { VendorService } from '~/modules/vendor/service'
import { TagService } from '~/modules/tag/service'
import { BankService } from '~/modules/bank/service'
import { PaymentTermService } from '~/modules/payment-term/service'
import { TaxComplianceService } from '~/modules/tax-compliance/service'
import { AuditLogService } from '~/modules/audit-log/service'

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
	const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27117/daxor_vendor_test'
	await mongoose.connect(uri)
	console.log(`Connected to ${uri}`)

	// Clean slate for idempotent reruns
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

	const requester = await User.create({
		email: 'requester@test.local',
		firstName: 'Ray',
		lastName: 'Requester',
		organizationId: org._id,
		roles: ['PURCHASE_MANAGER'],
	})

	await Organization.findByIdAndUpdate(org._id, {
		moduleApprovers: [{ moduleKey: 'vendors', approverUserIds: [approver._id] }],
	})

	const vendorService = new VendorService()
	const tagService = new TagService()
	const bankService = new BankService()
	const paymentTermService = new PaymentTermService()
	const taxComplianceService = new TaxComplianceService()
	const auditLogService = new AuditLogService()

	let vendorId = ''
	let tagId = ''
	let bankId = ''

	await check('payment terms: ensureDefaultsForOrganization seeds Net 15/30/45/60 + Due on Receipt', async () => {
		const terms = await paymentTermService.ensureDefaultsForOrganization(orgId)
		assert.equal(terms.length, 5)
		const names = terms.map((t: any) => t.name).sort()
		assert.deepEqual(names, ['Due on Receipt', 'Net 15', 'Net 30', 'Net 45', 'Net 60'].sort())
		// idempotent: second call returns existing rows, doesn't duplicate
		const again = await paymentTermService.ensureDefaultsForOrganization(orgId)
		assert.equal(again.length, 5)
	})

	await check('tag: create() creates a tag scoped to the org', async () => {
		const tag = await tagService.create({ name: 'Preferred Vendor', color: '#22c55e', category: 'Vendor Type', organizationId: orgId })
		tagId = String((tag as any)._id)
		assert.ok(tagId)
		assert.equal((tag as any).name, 'Preferred Vendor')
	})

	await check('tag: duplicate name in same org is rejected', async () => {
		let threw = false
		try {
			await tagService.create({ name: 'Preferred Vendor', organizationId: orgId })
		} catch {
			threw = true
		}
		assert.ok(threw, 'expected duplicate tag creation to throw')
	})

	await check('bank: create() creates a master bank record', async () => {
		const bank = await bankService.create({ name: 'HDFC Bank', bankIdentifierCode: 'HDFC0000123', organizationId: orgId })
		bankId = String((bank as any)._id)
		assert.ok(bankId)
	})

	await check('tax-compliance: checkGstinStatus rejects malformed GSTIN', async () => {
		const res = await taxComplianceService.checkGstinStatus('NOTAGSTIN')
		assert.equal(res.valid, false)
		assert.equal(res.status, 'INVALID')
	})

	await check('tax-compliance: checkGstinStatus accepts a well-formed GSTIN (mock provider)', async () => {
		const res = await taxComplianceService.checkGstinStatus('27ABCDE1234F1Z5')
		assert.equal(res.valid, true)
		assert.equal(res.status, 'ACTIVE')
		assert.equal(res.source, 'MOCK')
	})

	await check('tax-compliance: lookupPan rejects malformed PAN', async () => {
		const res = await taxComplianceService.lookupPan('BADPAN')
		assert.equal(res.valid, false)
	})

	await check('tax-compliance: lookupPan accepts a well-formed PAN and derives holder type', async () => {
		const res = await taxComplianceService.lookupPan('ABCPE1234F') // 4th char 'P' => Individual
		assert.equal(res.valid, true)
		assert.equal(res.holderType, 'Individual')
	})

	await check('vendor: createVendor persists full nested structure, forces draft/inactive, generates seqNo', async () => {
		const vendor: any = await vendorService.createVendor(
			{
				type: 'company',
				name: 'Acme Tools Pvt Ltd',
				address: { street: '221B Baker St', city: 'Chennai', zip: '600001', country: 'India' },
				gstTreatment: 'registered_business_regular',
				gstin: '33ABCDE1234F1Z5',
				pan: 'ABCDE1234F',
				phone: '9876543210',
				email: 'vendor@acme.test',
				tags: [{ tagId }],
				sales: { paymentMethod: 'Bank Transfer', deliveryMethod: 'Courier' },
				purchase: { fiscalPosition: 'Within Tamil Nadu' },
				misc: { company: 'Acme Group Holdings' },
				bankAccounts: [
					{ accountNumber: '000111222333', bankId, currency: 'INR', sendMoney: true },
				],
				accounting: { invoiceSendingPreference: 'postal' },
				warnings: { purchaseOrder: 'warning' },
				internalNotes: 'Test vendor for automated verification.',
				organizationId: orgId,
			},
			String(requester._id),
		)
		vendorId = String(vendor._id)
		assert.ok(vendor.seqNo?.startsWith('V-'))
		assert.equal(vendor.orgApprovalStatus, 'draft')
		assert.equal(vendor.status, 'inactive')
		assert.equal(vendor.tags.length, 1)
		assert.equal(vendor.tags[0].name, 'Preferred Vendor')
		assert.equal(vendor.bankAccounts.length, 1)
		assert.equal(vendor.bankAccounts[0].accountHolder, 'Acme Tools Pvt Ltd') // auto-filled from vendor name
		assert.equal(vendor.bankAccounts[0].bankName, 'HDFC Bank')
		assert.equal(vendor.warnings.purchaseOrder, 'warning')
		assert.equal(vendor.address.city, 'Chennai')
		// Gap fix: misc.company free-text field persists independently of companyId
		assert.equal(vendor.misc.company, 'Acme Group Holdings')
		// Gap fix: accounting.invoiceSendingPreference (Customer Invoice section)
		assert.equal(vendor.accounting.invoiceSendingPreference, 'postal')
	})

	await check('vendor: accounting.invoiceSendingPreference defaults to "email" when omitted', async () => {
		const v: any = await vendorService.createVendor({ name: 'Default Prefs Ltd', organizationId: orgId }, String(requester._id))
		assert.equal(v.accounting.invoiceSendingPreference, 'email')
	})

	await check('vendor: createVendor rejects malformed GSTIN format', async () => {
		let threw = false
		try {
			await vendorService.createVendor(
				{ name: 'Bad GSTIN Co', gstin: 'INVALIDGSTIN', organizationId: orgId },
				String(requester._id),
			)
		} catch {
			threw = true
		}
		assert.ok(threw, 'expected malformed GSTIN to be rejected at save time')
	})

	await check('audit log: "Contact created" entry exists for the new vendor', async () => {
		const logs = await auditLogService.findWithPagination(
			{ entityType: 'VENDOR', entityId: vendorId },
			{ page: 1, limit: 10 },
		)
		assert.ok(logs.data.length >= 1)
		assert.equal(logs.data[0].action, 'CREATE')
	})

	await check('audit log: entry carries a resolvable userId for the chatter/activity panel', async () => {
		const logs = await auditLogService.findWithPagination(
			{ entityType: 'VENDOR', entityId: vendorId },
			{ page: 1, limit: 10 },
		)
		const createLog: any = logs.data.find((l: any) => l.action === 'CREATE')
		assert.ok(createLog)
		assert.equal(String(createLog.userId), String(requester._id))
	})

	await check('vendor: addBankAccount appends a second account (nested Create Bank Account modal)', async () => {
		const updated: any = await vendorService.addBankAccount(
			vendorId,
			{ accountNumber: '999888777', bankId, currency: 'INR', sendMoney: false },
			String(requester._id),
		)
		assert.equal(updated.bankAccounts.length, 2)
	})

	await check('vendor: removeBankAccount removes the targeted account', async () => {
		const current: any = await vendorService.getVendorById(vendorId)
		const toRemove = String(current.bankAccounts[1]._id)
		const updated: any = await vendorService.removeBankAccount(vendorId, toRemove, String(requester._id))
		assert.equal(updated.bankAccounts.length, 1)
	})

	await check('vendor: submitForOrgApproval transitions draft -> submitted', async () => {
		const updated: any = await vendorService.submitForOrgApproval(vendorId, String(requester._id))
		assert.equal(updated.orgApprovalStatus, 'submitted')
	})

	await check('vendor: updateVendor is blocked while submitted', async () => {
		let threw = false
		try {
			await vendorService.updateVendor(vendorId, { name: 'Changed Name' }, String(requester._id))
		} catch {
			threw = true
		}
		assert.ok(threw, 'expected update to be blocked while pending approval')
	})

	await check('vendor: approveFromApprovalQueue transitions submitted -> approved/active', async () => {
		const updated: any = await vendorService.approveFromApprovalQueue(vendorId, String(approver._id))
		assert.equal(updated.orgApprovalStatus, 'approved')
		assert.equal(updated.status, 'active')
	})

	await check('vendor: declineFromApprovalQueue path works on a second vendor', async () => {
		const v2: any = await vendorService.createVendor(
			{ name: 'Decline Me Ltd', organizationId: orgId },
			String(requester._id),
		)
		await vendorService.submitForOrgApproval(String(v2._id), String(requester._id))
		const declined: any = await vendorService.declineFromApprovalQueue(String(v2._id), String(approver._id))
		assert.equal(declined.orgApprovalStatus, 'approval_declined')
		assert.equal(declined.status, 'inactive')
	})

	await check('gap 11: duplicate vendor blocked — same name in same org rejected', async () => {
		let threw = false
		try {
			await vendorService.createVendor({ name: 'Acme Tools Pvt Ltd', organizationId: orgId }, String(requester._id))
		} catch (err: any) {
			threw = true
			assert.ok(String(err.message).includes('already exists'))
		}
		assert.ok(threw, 'expected duplicate vendor name to be rejected')
	})

	await check('gap 11: duplicate vendor blocked — same GSTIN in same org rejected', async () => {
		let threw = false
		try {
			await vendorService.createVendor({ name: 'Completely Different Name But Same GSTIN', gstin: '33ABCDE1234F1Z5', organizationId: orgId }, String(requester._id))
		} catch (err: any) {
			threw = true
			assert.ok(String(err.message).includes('GSTIN'))
		}
		assert.ok(threw, 'expected duplicate GSTIN to be rejected')
	})

	await check('gap 10: approving own vendor blocked (self-approval guard)', async () => {
		const selfVendor: any = await vendorService.createVendor({ name: 'Self Approval Test Vendor', organizationId: orgId }, String(requester._id))
		await vendorService.submitForOrgApproval(String(selfVendor._id), String(requester._id))
		let threw = false
		try {
			await vendorService.approveFromApprovalQueue(String(selfVendor._id), String(requester._id))
		} catch (err: any) {
			threw = true
			assert.ok(String(err.message).toLowerCase().includes('segregation') || String(err.message).toLowerCase().includes('you cannot'))
		}
		assert.ok(threw, 'expected self-approval to be blocked')
	})

	console.log(`\n${passed} passed, ${failed} failed`)
	await mongoose.connection.close()
	process.exit(failed > 0 ? 1 : 0)
}

main().catch((err) => {
	console.error('Fatal error running vendor flow test:', err)
	process.exit(1)
})
