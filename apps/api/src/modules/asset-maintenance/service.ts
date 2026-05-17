import { GraphQLValidationError } from '@repo/errors'
import { AssetMaintenanceRepository } from './repository'

export interface PartUsageInput {
	itemId?: string | null
	itemName: string
	quantity: number
	unit?: string
	costPerUnit?: number
}

export interface AssetMaintenanceInput {
	organizationId: string
	docNumber: string
	assetId: string
	assetCode?: string
	assetName?: string
	maintenanceType?: string
	priority?: string
	scheduledDate: string | Date
	description: string
	assignedToUserId?: string | null
	assignedToName?: string
	vendorId?: string | null
	partsUsed?: PartUsageInput[]
	laborHours?: number
	laborRate?: number
	intervalDays?: number | null
	status?: string
	findings?: string
	actionsTaken?: string
	notes?: string
}

export class AssetMaintenanceService {
	private repository: AssetMaintenanceRepository

	constructor() {
		this.repository = new AssetMaintenanceRepository()
	}

	async create(input: AssetMaintenanceInput): Promise<any> {
		this.validate(input)
		const cost = this.computeCost(input)
		return this.repository.create({
			...input,
			docNumber: input.docNumber.trim().toUpperCase(),
			...cost,
			partsUsed: (input.partsUsed ?? []).map((p) => ({
				...p,
				quantity: Number(p.quantity),
				costPerUnit: Number(p.costPerUnit ?? 0),
				lineTotal: Math.round(Number(p.quantity) * Number(p.costPerUnit ?? 0) * 100) / 100,
				unit: p.unit ?? 'unit',
			})),
		})
	}

	async update(id: string, input: Partial<AssetMaintenanceInput>): Promise<any> {
		const patch: Record<string, unknown> = { ...input }
		if (input.docNumber) patch.docNumber = input.docNumber.trim().toUpperCase()
		const merged = (await this.repository.findById(id)) || {}
		const effective = { ...merged.toObject?.() ?? merged, ...input }
		const cost = this.computeCost(effective as any)
		Object.assign(patch, cost)
		if (Array.isArray(input.partsUsed)) {
			patch.partsUsed = input.partsUsed.map((p) => ({
				...p,
				quantity: Number(p.quantity),
				costPerUnit: Number(p.costPerUnit ?? 0),
				lineTotal: Math.round(Number(p.quantity) * Number(p.costPerUnit ?? 0) * 100) / 100,
				unit: p.unit ?? 'unit',
			}))
		}
		return this.repository.update(id, patch as any)
	}

	async list(organizationId: string, filters: any = {}) {
		return this.repository.list(organizationId, filters)
	}

	async findById(id: string) {
		return this.repository.findById(id)
	}

	async softDelete(id: string) {
		return this.repository.softDelete(id)
	}

	async upcoming(organizationId: string, days: number) {
		return this.repository.upcoming(organizationId, days)
	}

	async start(id: string): Promise<any> {
		return this.repository.update(id, { status: 'IN_PROGRESS', startedAt: new Date() } as any)
	}

	async complete(id: string, payload: { findings?: string; actionsTaken?: string; downtimeHours?: number }): Promise<any> {
		const row = await this.repository.findById(id)
		const next: any = {
			status: 'COMPLETED',
			completedAt: new Date(),
			findings: payload.findings,
			actionsTaken: payload.actionsTaken,
			downtimeHours: payload.downtimeHours,
		}
		// If preventive with interval, schedule next occurrence
		if (row?.intervalDays && Number(row.intervalDays) > 0) {
			const next_ = new Date(row.scheduledDate ?? new Date())
			next_.setDate(next_.getDate() + Number(row.intervalDays))
			next.nextScheduledDate = next_
		}
		return this.repository.update(id, next)
	}

	private computeCost(input: AssetMaintenanceInput): { partsCost: number; laborCost: number; totalCost: number } {
		const parts = (input.partsUsed ?? []).reduce(
			(s, p) => s + Number(p.quantity ?? 0) * Number(p.costPerUnit ?? 0),
			0,
		)
		const labor = Number(input.laborHours ?? 0) * Number(input.laborRate ?? 0)
		return {
			partsCost: Math.round(parts * 100) / 100,
			laborCost: Math.round(labor * 100) / 100,
			totalCost: Math.round((parts + labor) * 100) / 100,
		}
	}

	private validate(input: AssetMaintenanceInput) {
		if (!input.organizationId) throw new GraphQLValidationError('organizationId is required')
		if (!input.docNumber?.trim()) throw new GraphQLValidationError('Doc number is required')
		if (!input.assetId) throw new GraphQLValidationError('Asset is required')
		if (!input.description?.trim()) throw new GraphQLValidationError('Description is required')
		if (!input.scheduledDate) throw new GraphQLValidationError('Scheduled date is required')
	}
}
