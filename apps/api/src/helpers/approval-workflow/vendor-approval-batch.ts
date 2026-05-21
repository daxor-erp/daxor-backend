import { GraphQLValidationError } from '@repo/errors'
import {
	APPROVAL_ENTITY_VENDOR,
	MODULE_KEY_VENDORS,
} from './constants'
import { buildPendingPayloadForSubmit } from './submit-context'
import { approverIdsForModule, uniqApproverIds } from './approver'
import type { ApprovalWorkflowDeps } from './types'

async function resolveDisplayName(deps: ApprovalWorkflowDeps, userId: string): Promise<string> {
	const u = await deps.userService.findById(userId)
	return u ? `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.email : 'Unknown user'
}

function humanizeEntity(entityType: string): string {
	return String(entityType || '')
		.replace(/_/g, ' ')
		.toLowerCase()
		.replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * Vendor-only: enqueue one pending ApprovalRequest row per explicit assignee.
 * Validates org-admin configured approvers (`moduleApprovers` for MODULE_KEY_VENDORS).
 */
export async function createVendorApprovalRequestsWithAssignees(
	deps: ApprovalWorkflowDeps,
	opts: {
		vendorId: string
		requesterUserId: string
		assigneeUserIds: string[]
	},
): Promise<any[]> {
	let assignees = uniqApproverIds(opts.assigneeUserIds)
	if (!assignees.length) {
		throw new GraphQLValidationError('Select at least one approver.')
	}

	const vendorIdStr = String(opts.vendorId)
	const pendingCount = await deps.repository.countPendingForEntity(APPROVAL_ENTITY_VENDOR, vendorIdStr)
	if (pendingCount > 0) {
		throw new GraphQLValidationError('An approval request is already pending for this vendor.')
	}

	const payload = await buildPendingPayloadForSubmit(APPROVAL_ENTITY_VENDOR, vendorIdStr, deps)
	if (String(payload.moduleKey) !== MODULE_KEY_VENDORS) {
		throw new GraphQLValidationError('Vendor approval routing is misconfigured.')
	}

	const org = await deps.organizationService.findById(String(payload.organizationId))
	if (!org || org.deletedAt) throw new GraphQLValidationError('Organization not found')

	const eligible = approverIdsForModule(org as { moduleApprovers?: unknown[] }, MODULE_KEY_VENDORS)
	if (!eligible.length) {
		throw new GraphQLValidationError(
			'No vendors approvers are configured. Ask your organization admin under Approvals → Vendors.',
		)
	}
	if (!assignees.every((id) => eligible.includes(id))) {
		throw new GraphQLValidationError('One or more selected users are not configured as vendors approvers.')
	}

	const requesterDisplayName = await resolveDisplayName(deps, opts.requesterUserId)
	const created: any[] = []

	for (const assigneeId of assignees) {
		const assignee = await deps.userService.findById(assigneeId)
		if (!assignee || assignee.deletedAt || String(assignee.organizationId) !== String(payload.organizationId)) {
			throw new GraphQLValidationError('Selected approver is not valid for this organization.')
		}

		const row = await deps.repository.create({
			organizationId: payload.organizationId,
			moduleKey: payload.moduleKey,
			entityType: payload.entityType,
			entityId: payload.entityId,
			title: payload.title,
			status: 'PENDING',
			requesterUserId: opts.requesterUserId,
			requesterDisplayName,
			assigneeApproverUserId: assigneeId,
		})

		if (deps.notificationService) {
			await deps.notificationService.notify({
				organizationId: String(payload.organizationId),
				recipientUserId: String(assigneeId),
				actorUserId: String(opts.requesterUserId),
				kind: 'APPROVAL_REQUEST',
				severity: 'WARNING',
				title: `Approval needed: ${payload.title}`,
				message: `${requesterDisplayName} submitted a ${humanizeEntity(payload.entityType)} for your approval.`,
				link: '/notifications',
				referenceModule: 'approval-request',
				referenceId: String((row as any)?._id ?? (row as any)?.id ?? ''),
				moduleKey: String(payload.moduleKey ?? ''),
			})
		}
		created.push(row)
	}

	return created
}
