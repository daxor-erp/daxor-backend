import { GraphQLValidationError } from '@repo/errors'
import { FixedAssetRepository } from './repository'
import { accountingPosting } from '../../lib/accounting-posting'

export interface FixedAssetInput {
	organizationId: string
	assetCode: string
	name: string
	description?: string
	category?: string
	assignedToUserId?: string | null
	siteLocationId?: string | null
	vendorId?: string | null
	purchaseDate: string | Date
	commissionedDate?: string | Date | null
	acquisitionCost: number
	salvageValue?: number
	usefulLifeMonths: number
	depreciationMethod?: string
	depreciationRatePercent?: number | null
	status?: string
	barcode?: string
	serialNumber?: string
	warrantyExpiryDate?: string | Date | null
	notes?: string
}

export class FixedAssetService {
	private repository: FixedAssetRepository
	constructor() {
		this.repository = new FixedAssetRepository()
	}

	async create(input: FixedAssetInput): Promise<any> {
		this.validate(input)
		const bookValue = Number(input.acquisitionCost) - 0 // no depreciation posted yet
		const created = await this.repository.create({
			...input,
			assetCode: input.assetCode.trim().toUpperCase(),
			name: input.name.trim(),
			accumulatedDepreciation: 0,
			bookValue,
			depreciationHistory: [],
		})
		return created
	}

	async update(id: string, input: Partial<FixedAssetInput>): Promise<any> {
		const patch: Record<string, unknown> = { ...input }
		if (typeof patch.name === 'string') patch.name = patch.name.trim()
		if (typeof patch.assetCode === 'string') patch.assetCode = (patch.assetCode as string).trim().toUpperCase()
		return this.repository.update(id, patch as any)
	}

	async list(organizationId: string, filters: { status?: string; category?: string; search?: string } = {}) {
		return this.repository.listForOrganization(organizationId, filters)
	}

	async findById(id: string) {
		return this.repository.findById(id)
	}

	async softDelete(id: string) {
		return this.repository.softDelete(id)
	}

	async summaryByCategory(organizationId: string) {
		return this.repository.summaryByCategory(organizationId)
	}

	/**
	 * Post depreciation for a single period. Updates accumulatedDepreciation,
	 * bookValue and appends a history entry. If usefulLife is exceeded, returns
	 * zero-amount entries.
	 */
	async postDepreciation(
		id: string,
		input: { periodEndDate: string | Date; amount?: number; notes?: string },
	): Promise<any> {
		const asset = await this.repository.findById(id)
		if (!asset) throw new GraphQLValidationError('Asset not found')

		const purchase = new Date(asset.purchaseDate).getTime()
		const periodEnd = new Date(input.periodEndDate).getTime()
		if (Number.isNaN(periodEnd)) throw new GraphQLValidationError('Invalid period end date')
		if (periodEnd < purchase) {
			throw new GraphQLValidationError('Depreciation period cannot be before purchase date')
		}

		const cost = Number(asset.acquisitionCost ?? 0)
		const salvage = Number(asset.salvageValue ?? 0)
		const life = Math.max(1, Number(asset.usefulLifeMonths ?? 1))
		const method = String(asset.depreciationMethod ?? 'STRAIGHT_LINE')
		const ratePct = Number(asset.depreciationRatePercent ?? 0)

		let amount = 0
		if (typeof input.amount === 'number' && input.amount >= 0) {
			amount = input.amount
		} else if (method === 'STRAIGHT_LINE') {
			amount = Math.max(0, (cost - salvage) / life)
		} else if (method === 'DECLINING_BALANCE' || method === 'WDV') {
			const baseBook = Number(asset.bookValue ?? cost)
			amount = Math.max(0, (baseBook * (ratePct || 0)) / 100 / 12)
		} else {
			amount = Math.max(0, (cost - salvage) / life)
		}

		const newAccum = Math.min(cost - salvage, Number(asset.accumulatedDepreciation ?? 0) + amount)
		const newBook = Math.max(salvage, cost - newAccum)

		const entry = {
			periodEndDate: new Date(periodEnd),
			amount: Math.round(amount * 100) / 100,
			accumulatedDepreciation: Math.round(newAccum * 100) / 100,
			bookValue: Math.round(newBook * 100) / 100,
			method,
			notes: input.notes,
			postedAt: new Date(),
		}

		const updated = await this.repository.update(id, {
			accumulatedDepreciation: entry.accumulatedDepreciation,
			bookValue: entry.bookValue,
			$push: { depreciationHistory: entry },
		} as any)
		const periodLabel = new Date(periodEnd).toISOString().slice(0, 7)
		await accountingPosting.postFixedAssetDepreciation(
			updated ?? asset,
			entry.amount,
			'system',
			periodLabel,
		)
		return updated
	}

	async dispose(id: string, disposalDate: string | Date, notes?: string): Promise<any> {
		return this.repository.update(id, {
			status: 'DISPOSED',
			disposalDate: new Date(disposalDate),
			notes,
		} as any)
	}

	private validate(input: FixedAssetInput) {
		if (!input.name?.trim()) throw new GraphQLValidationError('Asset name is required')
		if (!input.assetCode?.trim()) throw new GraphQLValidationError('Asset code is required')
		if (!input.purchaseDate) throw new GraphQLValidationError('Purchase date is required')
		if (typeof input.acquisitionCost !== 'number' || input.acquisitionCost < 0) {
			throw new GraphQLValidationError('Acquisition cost must be ≥ 0')
		}
		if (typeof input.usefulLifeMonths !== 'number' || input.usefulLifeMonths < 1) {
			throw new GraphQLValidationError('Useful life must be at least 1 month')
		}
		if (
			input.salvageValue != null &&
			(typeof input.salvageValue !== 'number' || input.salvageValue < 0)
		) {
			throw new GraphQLValidationError('Salvage value must be ≥ 0')
		}
	}
}
