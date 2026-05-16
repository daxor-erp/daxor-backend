import { GraphQLValidationError } from '@repo/errors'
import type { ApprovalWorkflowDeps } from './types'

export function approverIdForModule(
	org: { moduleApprovers?: { moduleKey?: string; approverUserId?: unknown }[] },
	moduleKey: string,
): string | null {
	const rows = org?.moduleApprovers ?? []
	const row = rows.find((r) => String(r?.moduleKey) === moduleKey)
	const uid = row?.approverUserId
	if (uid == null) return null
	return String(uid)
}

export async function ensureApproverConfigured(
	deps: Pick<ApprovalWorkflowDeps, 'organizationService' | 'userService'>,
	organizationId: string,
	moduleKey: string,
): Promise<void> {
	const org = await deps.organizationService.findById(String(organizationId))
	if (!org || org.deletedAt) throw new GraphQLValidationError('Organization not found')

	const assigneeId = approverIdForModule(org, moduleKey)
	if (!assigneeId) {
		throw new GraphQLValidationError(
			`No approver is configured for "${moduleKey}". Ask your organization admin to assign one under Approvals.`,
		)
	}

	const assignee = await deps.userService.findById(assigneeId)
	if (!assignee || assignee.deletedAt || String(assignee.organizationId) !== String(organizationId)) {
		throw new GraphQLValidationError('Configured approver is not valid for this organization.')
	}
}
