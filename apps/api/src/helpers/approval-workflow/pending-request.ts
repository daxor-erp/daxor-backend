import { GraphQLValidationError } from '@repo/errors'
import { approverIdForModule } from './approver'
import type { ApprovalWorkflowDeps, PendingApprovalCreateOpts } from './types'

async function resolveRequesterName(deps: ApprovalWorkflowDeps, requesterUserId: string): Promise<string> {
	const requester = await deps.userService.findById(requesterUserId)
	return requester
		? `${requester.firstName ?? ''} ${requester.lastName ?? ''}`.trim() || requester.email
		: 'Unknown user'
}

export async function createPendingApprovalRequest(
	deps: ApprovalWorkflowDeps,
	opts: PendingApprovalCreateOpts,
): Promise<any> {
	const entityIdStr = String(opts.entityId)

	const existing = await deps.repository.findPendingForEntity(opts.entityType, entityIdStr)
	if (existing) return existing

	const org = await deps.organizationService.findById(String(opts.organizationId))
	if (!org || org.deletedAt) throw new GraphQLValidationError('Organization not found')

	const assigneeId = approverIdForModule(org, opts.moduleKey)
	if (!assigneeId) {
		throw new GraphQLValidationError(
			`No approver is configured for "${opts.moduleKey}". Ask your organization admin to assign one under Approvals.`,
		)
	}

	const assignee = await deps.userService.findById(assigneeId)
	if (!assignee || assignee.deletedAt || String(assignee.organizationId) !== String(opts.organizationId)) {
		throw new GraphQLValidationError('Configured approver is not valid for this organization.')
	}

	const requesterDisplayName = await resolveRequesterName(deps, opts.requesterUserId)

	return deps.repository.create({
		organizationId: opts.organizationId,
		moduleKey: opts.moduleKey,
		entityType: opts.entityType,
		entityId: opts.entityId,
		title: opts.title,
		status: 'PENDING',
		requesterUserId: opts.requesterUserId,
		requesterDisplayName,
		assigneeApproverUserId: assigneeId,
	})
}
