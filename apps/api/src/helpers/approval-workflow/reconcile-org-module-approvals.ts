import {
	APPROVAL_ENTITY_CUSTOMER_INVOICE,
	APPROVAL_ENTITY_DELIVERY_CHALLAN,
	APPROVAL_ENTITY_GRN,
	APPROVAL_ENTITY_MATERIAL_RECEIPT,
	APPROVAL_ENTITY_PAYROLL_MANAGEMENT,
	APPROVAL_ENTITY_PAYROLL_UI_RECORD,
	APPROVAL_ENTITY_PROJECT,
	APPROVAL_ENTITY_PURCHASE_ORDER,
	APPROVAL_ENTITY_QUOTATION,
	APPROVAL_ENTITY_SALES_ENQUIRY,
	APPROVAL_ENTITY_SALES_ORDER,
	APPROVAL_ENTITY_SALES_RETURN,
	APPROVAL_ENTITY_VENDOR_BILL,
	MODULE_KEY_PAYABLES,
	MODULE_KEY_PAYROLL,
	MODULE_KEY_PURCHASES,
	MODULE_KEY_QUOTATIONS,
	MODULE_KEY_SALES,
} from './constants'
import { approverIdsForModule, collectApproverUserIdsFromOrgRow } from './approver'
import { buildPendingPayloadForSubmit } from './submit-context'
import { createPendingApprovalRequest } from './pending-request'
import { deriveSalesEnquiryWorkflowStatus, RECORD_APPROVAL_PENDING } from './record-approval-status'
import type { ApprovalWorkflowDeps } from './types'
import { CustomerInvoice } from '~/modules/customer-invoice/model'
import { DeliveryChallan } from '~/modules/delivery-challan/model'
import { GRN } from '~/modules/grn/model'
import { MaterialReceipt } from '~/modules/material-receipt/model'
import { PayrollManagement } from '~/modules/payroll-management/model'
import { PayrollUiRecord } from '~/modules/payroll-ui-record/model'
import { Project } from '~/modules/project/model'
import { Quotation } from '~/modules/quotation/model'
import { SalesOrder } from '~/modules/sales-order/model'
import { SalesReturn } from '~/modules/sales-return/model'
import { VendorBill } from '~/modules/vendor-bill/model'

type PendingEntityRef = {
	entityType: string
	entityId: string
	requesterUserId: string
}

function ref(doc: { _id?: unknown; id?: unknown; createdBy?: unknown }, entityType: string): PendingEntityRef | null {
	const entityId = String(doc._id ?? doc.id ?? '')
	if (!entityId) return null
	return {
		entityType,
		entityId,
		requesterUserId: String(doc.createdBy ?? ''),
	}
}

async function collectPendingEntitiesForModule(
	deps: ApprovalWorkflowDeps,
	organizationId: string,
	moduleKey: string,
): Promise<PendingEntityRef[]> {
	const org = String(organizationId)
	const out: PendingEntityRef[] = []

	if (moduleKey === MODULE_KEY_PURCHASES) {
		const orders = await deps.purchaseOrderService.findPendingApprovalByOrganization(org)
		for (const po of orders) {
			const r = ref(po, APPROVAL_ENTITY_PURCHASE_ORDER)
			if (r) out.push(r)
		}
		const projects = await Project.find({ organizationId: org, deletedAt: null, orgApprovalStatus: 'submitted' }).exec()
		for (const p of projects) {
			const r = ref(p, APPROVAL_ENTITY_PROJECT)
			if (r) out.push(r)
		}
		const grns = await GRN.find({ organizationId: org, deletedAt: null, status: 'submitted' }).exec()
		for (const g of grns) {
			const r = ref(g, APPROVAL_ENTITY_GRN)
			if (r) out.push(r)
		}
		const receipts = await MaterialReceipt.find({ organizationId: org, deletedAt: null, status: 'submitted' }).exec()
		for (const m of receipts) {
			const r = ref(m, APPROVAL_ENTITY_MATERIAL_RECEIPT)
			if (r) out.push(r)
		}
	}

	if (moduleKey === MODULE_KEY_SALES) {
		const enquiries = await deps.salesEnquiryService.findPendingApprovalByOrganization(org)
		for (const enq of enquiries) {
			if (deriveSalesEnquiryWorkflowStatus(enq) !== RECORD_APPROVAL_PENDING) continue
			const r = ref(enq, APPROVAL_ENTITY_SALES_ENQUIRY)
			if (r) out.push(r)
		}
		const orders = await SalesOrder.find({
			organizationId: org,
			deletedAt: null,
			status: 'submitted',
			$or: [{ cashSale: { $exists: false } }, { cashSale: false }, { cashSale: null }],
		}).exec()
		for (const so of orders) {
			const r = ref(so, APPROVAL_ENTITY_SALES_ORDER)
			if (r) out.push(r)
		}
		const invoices = await CustomerInvoice.find({ organizationId: org, deletedAt: null, status: 'submitted' }).exec()
		for (const inv of invoices) {
			const r = ref(inv, APPROVAL_ENTITY_CUSTOMER_INVOICE)
			if (r) out.push(r)
		}
		const returns = await SalesReturn.find({ organizationId: org, isDeleted: { $ne: true }, status: 'SUBMITTED' }).exec()
		for (const sr of returns) {
			const r = ref(sr, APPROVAL_ENTITY_SALES_RETURN)
			if (r) out.push(r)
		}
		const challans = await DeliveryChallan.find({ organizationId: org, isDeleted: { $ne: true }, status: 'SUBMITTED' }).exec()
		for (const dc of challans) {
			const r = ref(dc, APPROVAL_ENTITY_DELIVERY_CHALLAN)
			if (r) out.push(r)
		}
	}

	if (moduleKey === MODULE_KEY_QUOTATIONS) {
		const quotes = await Quotation.find({ organizationId: org, deletedAt: null, status: 'submitted' }).exec()
		for (const q of quotes) {
			const r = ref(q, APPROVAL_ENTITY_QUOTATION)
			if (r) out.push(r)
		}
	}

	if (moduleKey === MODULE_KEY_PAYABLES) {
		const bills = await VendorBill.find({ organizationId: org, deletedAt: null, status: 'submitted' }).exec()
		for (const b of bills) {
			const r = ref(b, APPROVAL_ENTITY_VENDOR_BILL)
			if (r) out.push(r)
		}
	}

	if (moduleKey === MODULE_KEY_PAYROLL) {
		const uiRows = await PayrollUiRecord.find({ organizationId: org, approvalStatus: 'pending' }).exec()
		for (const row of uiRows) {
			const r = ref(row, APPROVAL_ENTITY_PAYROLL_UI_RECORD)
			if (r) out.push(r)
		}
		const pmRows = await PayrollManagement.find({ organizationId: org, status: 'SUBMITTED' }).exec()
		for (const row of pmRows) {
			const r = ref(row, APPROVAL_ENTITY_PAYROLL_MANAGEMENT)
			if (r) out.push(r)
		}
	}

	return out
}

function humanizeEntity(entityType: string): string {
	return String(entityType || '')
		.replace(/_/g, ' ')
		.toLowerCase()
		.replace(/\b\w/g, (c) => c.toUpperCase())
}

async function notifyAssignee(
	deps: ApprovalWorkflowDeps,
	opts: {
		organizationId: string
		assigneeUserId: string
		actorUserId: string
		title: string
		entityType: string
		moduleKey: string
		referenceId: string
		requesterName?: string | null
	},
): Promise<void> {
	if (!deps.notificationService) return
	try {
		await deps.notificationService.notify({
			organizationId: opts.organizationId,
			recipientUserId: opts.assigneeUserId,
			actorUserId: opts.actorUserId,
			kind: 'APPROVAL_REQUEST',
			severity: 'WARNING',
			title: `Approval needed: ${opts.title}`,
			message: `${opts.requesterName ?? 'A colleague'} submitted a ${humanizeEntity(opts.entityType)} for your approval.`,
			link: '/notifications',
			referenceModule: 'approval-request',
			referenceId: opts.referenceId,
			moduleKey: opts.moduleKey,
		})
	} catch {
		// best-effort
	}
}

async function syncEntityApproval(
	deps: ApprovalWorkflowDeps,
	organizationId: string,
	moduleKey: string,
	primaryAssigneeId: string,
	entity: PendingEntityRef,
): Promise<void> {
	const existing = await deps.repository.findPendingForEntity(entity.entityType, entity.entityId)

	if (!existing) {
		try {
			const payload = await buildPendingPayloadForSubmit(entity.entityType, entity.entityId, deps)
			await createPendingApprovalRequest(deps, {
				...payload,
				requesterUserId: entity.requesterUserId || primaryAssigneeId,
			})
		} catch {
			// entity no longer eligible for routing
		}
		return
	}

	if (String(existing.assigneeApproverUserId ?? '') === String(primaryAssigneeId)) return

	const rowId = String(existing._id ?? existing.id ?? '')
	if (!rowId) return

	await deps.repository.update(rowId, {
		assigneeApproverUserId: primaryAssigneeId,
		updatedAt: new Date(),
	})

	await notifyAssignee(deps, {
		organizationId,
		assigneeUserId: primaryAssigneeId,
		actorUserId: String(existing.requesterUserId ?? primaryAssigneeId),
		title: String(existing.title ?? humanizeEntity(entity.entityType)),
		entityType: entity.entityType,
		moduleKey,
		referenceId: rowId,
		requesterName: existing.requesterDisplayName,
	})
}

/** Ensures pending records + queue rows for one module are assigned to the current approver. */
export async function reconcileModuleApprovalsForOrg(
	deps: ApprovalWorkflowDeps,
	organizationId: string,
	moduleKey: string,
): Promise<void> {
	const org = await deps.organizationService.findById(String(organizationId))
	if (!org || org.deletedAt) return

	const assigneeIds = approverIdsForModule(org as { moduleApprovers?: unknown[] }, moduleKey)
	if (!assigneeIds.length) return

	const primaryAssigneeId = assigneeIds[0]!
	const assignee = await deps.userService.findById(primaryAssigneeId)
	if (!assignee || assignee.deletedAt || String(assignee.organizationId) !== String(organizationId)) {
		return
	}

	const entities = await collectPendingEntitiesForModule(deps, organizationId, moduleKey)
	for (const entity of entities) {
		await syncEntityApproval(deps, String(organizationId), moduleKey, primaryAssigneeId, entity)
	}

	await deps.repository.reassignPendingModuleRows(String(organizationId), moduleKey, primaryAssigneeId)
}

/** Reconcile every module the user is designated to approve. */
export async function reconcileApprovalsForAssignee(
	deps: ApprovalWorkflowDeps,
	organizationId: string,
	userId: string,
): Promise<void> {
	const org = await deps.organizationService.findById(String(organizationId))
	if (!org || org.deletedAt) return

	const rows = Array.isArray(org.moduleApprovers) ? org.moduleApprovers : []
	for (const row of rows) {
		const r = row as { moduleKey?: string }
		if (!r?.moduleKey) continue
		const ids = collectApproverUserIdsFromOrgRow(row)
		if (!ids.some((id) => String(id) === String(userId))) continue
		await reconcileModuleApprovalsForOrg(deps, organizationId, String(r.moduleKey))
	}
}

/** Reconcile all modules that currently have at least one configured approver. */
export async function reconcileAllConfiguredModuleApprovals(
	deps: ApprovalWorkflowDeps,
	organizationId: string,
	moduleKeys?: string[],
): Promise<void> {
	const org = await deps.organizationService.findById(String(organizationId))
	if (!org || org.deletedAt) return

	const rows = Array.isArray(org.moduleApprovers) ? org.moduleApprovers : []
	const keys = moduleKeys?.length
		? moduleKeys
		: rows
				.map((row) => String((row as { moduleKey?: string }).moduleKey ?? ''))
				.filter(Boolean)

	for (const moduleKey of keys) {
		const ids = approverIdsForModule(org as { moduleApprovers?: unknown[] }, moduleKey)
		if (!ids.length) continue
		await reconcileModuleApprovalsForOrg(deps, organizationId, moduleKey)
	}
}
