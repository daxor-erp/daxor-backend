import { GraphQLValidationError } from '@repo/errors'
import { QualityControlRepository } from './repository'

export interface DefectInput {
	code: string
	description?: string
	severity?: string
	quantity?: number
	rootCause?: string
	correctiveAction?: string
}

export interface QCInspectionInput {
	organizationId: string
	docNumber: string
	inspectionDate: string | Date
	inspectorUserId?: string
	inspectorName?: string
	sourceModule: string
	sourceId?: string | null
	itemId?: string | null
	itemName: string
	batchNumber?: string
	quantityInspected: number
	quantityPassed?: number
	quantityFailed?: number
	quantityReworked?: number
	defects?: DefectInput[]
	outcome?: string
	notes?: string
}

export class QualityControlService {
	private repository: QualityControlRepository

	constructor() {
		this.repository = new QualityControlRepository()
	}

	async create(input: QCInspectionInput): Promise<any> {
		this.validate(input)
		return this.repository.create({
			...input,
			docNumber: input.docNumber.trim().toUpperCase(),
			defects: (input.defects ?? []).map((d) => ({
				code: d.code.trim().toUpperCase(),
				description: d.description,
				severity: d.severity ?? 'MINOR',
				quantity: Number(d.quantity ?? 1),
				rootCause: d.rootCause,
				correctiveAction: d.correctiveAction,
			})),
			quantityPassed: Number(input.quantityPassed ?? 0),
			quantityFailed: Number(input.quantityFailed ?? 0),
			quantityReworked: Number(input.quantityReworked ?? 0),
			outcome: input.outcome ?? 'PENDING',
		})
	}

	async update(id: string, input: Partial<QCInspectionInput>): Promise<any> {
		const patch: Record<string, unknown> = { ...input }
		if (input.docNumber) patch.docNumber = input.docNumber.trim().toUpperCase()
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

	async outcomeSummary(organizationId: string) {
		return this.repository.outcomeSummary(organizationId)
	}

	async setOutcome(id: string, outcome: string, notes?: string): Promise<any> {
		return this.repository.update(id, { outcome, notes } as any)
	}

	private validate(input: QCInspectionInput) {
		if (!input.organizationId) throw new GraphQLValidationError('organizationId is required')
		if (!input.docNumber?.trim()) throw new GraphQLValidationError('Doc number is required')
		if (!input.sourceModule) throw new GraphQLValidationError('Source module is required')
		if (!input.itemName?.trim()) throw new GraphQLValidationError('Item name is required')
		if (!input.inspectionDate) throw new GraphQLValidationError('Inspection date is required')
		if (!Number.isFinite(input.quantityInspected) || input.quantityInspected < 0) {
			throw new GraphQLValidationError('Quantity inspected must be ≥ 0')
		}
		const total = Number(input.quantityPassed ?? 0) + Number(input.quantityFailed ?? 0) + Number(input.quantityReworked ?? 0)
		if (total > Number(input.quantityInspected) + 0.001) {
			throw new GraphQLValidationError(`Passed + failed + reworked (${total}) cannot exceed inspected (${input.quantityInspected})`)
		}
	}
}
