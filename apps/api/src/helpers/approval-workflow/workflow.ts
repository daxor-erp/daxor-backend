import { createPendingApprovalRequest } from './pending-request'
import { buildPendingPayloadForSubmit } from './submit-context'
import { applyApprovalDecisionToEntity } from './resolve-entity'
import { ensureApproverConfigured } from './approver'
import type { ApprovalDecision, ApprovalWorkflowDeps, InitiateApprovalWorkflowInput } from './types'

/**
 * Generic entry point for enqueueing an approval task (same behavior as prior per-module enqueue* methods).
 */
export async function initiateApprovalWorkflow(
	input: InitiateApprovalWorkflowInput,
	deps: ApprovalWorkflowDeps,
): Promise<any> {
	if (input.action !== 'SUBMIT') {
		throw new Error(`Unsupported approval workflow action: ${String((input as any).action)}`)
	}
	const payload = await buildPendingPayloadForSubmit(input.entityType, input.entityId, deps)
	return createPendingApprovalRequest(deps, {
		...payload,
		requesterUserId: input.requesterUserId,
	})
}

export async function handleApprovalResolution(
	deps: ApprovalWorkflowDeps,
	entityType: string,
	entityId: string,
	decision: ApprovalDecision,
	decidedByUserId: string,
): Promise<void> {
	await applyApprovalDecisionToEntity(deps, entityType, entityId, decision, decidedByUserId)
}

export { ensureApproverConfigured }
