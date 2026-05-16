import { ModuleWorkspaceRecordRepository } from './repository'

export class ModuleWorkspaceRecordService {
	private repo: ModuleWorkspaceRecordRepository

	constructor() {
		this.repo = new ModuleWorkspaceRecordRepository()
	}

	async create(data: {
		organizationId: unknown
		routePath: string
		approvalModuleKey: string
		title: string
		detail?: string | null
		snapshot?: unknown
		userId: string | null | undefined
	}): Promise<any> {
		return this.repo.create({
			organizationId: data.organizationId,
			routePath: data.routePath,
			approvalModuleKey: data.approvalModuleKey,
			title: data.title.trim(),
			detail: data.detail?.trim() || undefined,
			snapshot: data.snapshot ?? undefined,
			status: 'draft',
			createdByUserId: data.userId || undefined,
			updatedByUserId: data.userId || undefined,
		})
	}

	async findById(id: string): Promise<any | null> {
		return this.repo.findById(id)
	}

	async listForRoute(organizationId: string, routePath: string, limit = 100): Promise<any[]> {
		return this.repo.findByOrganizationAndRoute(organizationId, routePath, limit)
	}

	async updateFields(
		id: string,
		fields: Partial<{ title: string; detail: string | null; snapshot: unknown; updatedByUserId: unknown }>,
	): Promise<any> {
		const data: Record<string, unknown> = { updatedAt: new Date() }
		if (fields.title !== undefined) data.title = fields.title
		if (fields.detail !== undefined) data.detail = fields.detail ?? undefined
		if (fields.snapshot !== undefined) data.snapshot = fields.snapshot ?? undefined
		if (fields.updatedByUserId !== undefined) data.updatedByUserId = fields.updatedByUserId
		return this.repo.update(id, data)
	}

	async setStatus(
		id: string,
		status: 'draft' | 'pending_approval' | 'approved' | 'rejected',
		userId?: string | null,
	): Promise<any> {
		return this.repo.update(id, {
			status,
			updatedByUserId: userId || undefined,
			updatedAt: new Date(),
		})
	}

	async markPendingApproval(id: string, userId: string | undefined): Promise<any> {
		return this.repo.update(id, {
			status: 'pending_approval',
			updatedByUserId: userId || undefined,
			updatedAt: new Date(),
		})
	}

	async markApproved(id: string, decidedByUserId: string): Promise<any> {
		return this.repo.update(id, {
			status: 'approved',
			updatedByUserId: decidedByUserId,
			updatedAt: new Date(),
		})
	}

	async markRejected(id: string, decidedByUserId: string): Promise<any> {
		return this.repo.update(id, {
			status: 'rejected',
			updatedByUserId: decidedByUserId,
			updatedAt: new Date(),
		})
	}
}
