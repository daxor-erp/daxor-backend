/** Shared workflow labels for ERP records (persisted + GraphQL enum). */
export const RECORD_APPROVAL_DRAFT = 'DRAFT'
export const RECORD_APPROVAL_PENDING = 'PENDING_APPROVAL'
export const RECORD_APPROVAL_APPROVED = 'APPROVED'
export const RECORD_APPROVAL_REJECTED = 'REJECTED'

export type RecordApprovalWorkflowStatus =
	| typeof RECORD_APPROVAL_DRAFT
	| typeof RECORD_APPROVAL_PENDING
	| typeof RECORD_APPROVAL_APPROVED
	| typeof RECORD_APPROVAL_REJECTED

/**
 * Derives workflow status for legacy SalesEnquiry documents without `approvalStatus`.
 */
export function deriveSalesEnquiryWorkflowStatus(doc: {
	approvalStatus?: string | null
	status?: string | null
}): RecordApprovalWorkflowStatus {
	const a = String(doc.approvalStatus ?? '').toUpperCase()
	if (
		a === RECORD_APPROVAL_DRAFT ||
		a === RECORD_APPROVAL_PENDING ||
		a === RECORD_APPROVAL_APPROVED ||
		a === RECORD_APPROVAL_REJECTED
	) {
		return a as RecordApprovalWorkflowStatus
	}
	const st = String(doc.status ?? '')
	if (st === 'submitted') return RECORD_APPROVAL_PENDING
	if (st === 'approval_declined') return RECORD_APPROVAL_REJECTED
	if (st === 'new') return RECORD_APPROVAL_DRAFT
	return RECORD_APPROVAL_APPROVED
}
