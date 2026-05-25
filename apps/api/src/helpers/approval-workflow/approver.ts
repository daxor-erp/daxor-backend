import { GraphQLValidationError } from '@repo/errors'
import type { ApprovalWorkflowDeps } from './types'

export function uniqApproverIds(ids: string[]): string[] {
	return [...new Set(ids.map((id) => String(id).trim()).filter(Boolean))]
}

/** Collect IDs from one organization.moduleApprovers subdocument (supports legacy approverUserId + approverUserIds array). */
export function collectApproverUserIdsFromOrgRow(row: unknown): string[] {
	if (!row || typeof row !== 'object') return []
	const r = row as { approverUserId?: unknown; approverUserIds?: unknown }
	const fromArr = Array.isArray(r.approverUserIds)
		? r.approverUserIds.map((x) => String(x)).filter(Boolean)
		: []
	if (fromArr.length) return uniqApproverIds(fromArr)
	if (r.approverUserId != null && String(r.approverUserId).trim())
		return [String(r.approverUserId)]
	return []
}

/**
 * All designated approvers for `moduleKey` (union if multiple legacy rows existed).
 */
export function approverIdsForModule(org: { moduleApprovers?: unknown[] }, moduleKey: string): string[] {
	const rows = org?.moduleApprovers ?? []
	const out: string[] = []
	for (const row of rows) {
		const r = row as { moduleKey?: string }
		if (!r?.moduleKey || String(r.moduleKey) !== String(moduleKey)) continue
		out.push(...collectApproverUserIdsFromOrgRow(row))
	}
	return uniqApproverIds(out)
}

/** First assignee ID for modules that remain single-assignee in `createPendingApprovalRequest`. */
export function approverIdForModule(
	org: { moduleApprovers?: unknown[] },
	moduleKey: string,
): string | null {
	const ids = approverIdsForModule(org, moduleKey)
	return ids[0] ?? null
}

export async function ensureApproverConfigured(
	deps: Pick<ApprovalWorkflowDeps, 'organizationService' | 'userService'>,
	organizationId: string,
	moduleKey: string,
): Promise<void> {
	const org = await deps.organizationService.findById(String(organizationId))
	if (!org || org.deletedAt) throw new GraphQLValidationError('Organization not found')

	const assigneeIds = approverIdsForModule(org as { moduleApprovers?: unknown[] }, moduleKey)
	if (!assigneeIds.length) {
		throw new GraphQLValidationError(
			`No approver is configured for "${moduleKey}". Ask your organization admin to assign one under Approvals.`,
		)
	}

	for (const assigneeId of assigneeIds) {
		const assignee = await deps.userService.findById(assigneeId)
		if (!assignee || assignee.deletedAt || String(assignee.organizationId) !== String(organizationId)) {
			throw new GraphQLValidationError('Configured approver is not valid for this organization.')
		}
	}
}
