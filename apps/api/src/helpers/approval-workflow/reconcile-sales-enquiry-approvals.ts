import { MODULE_KEY_SALES } from './constants'
import { reconcileModuleApprovalsForOrg } from './reconcile-org-module-approvals'
import type { ApprovalWorkflowDeps } from './types'

/** @deprecated Use reconcileModuleApprovalsForOrg(deps, orgId, MODULE_KEY_SALES) */
export async function reconcileSalesEnquiryApprovalsForOrg(
	deps: ApprovalWorkflowDeps,
	organizationId: string,
): Promise<void> {
	await reconcileModuleApprovalsForOrg(deps, organizationId, MODULE_KEY_SALES)
}
