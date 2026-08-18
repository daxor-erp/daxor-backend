import { ProductVariantRepository } from './repository'
import { AttributeService } from '../attribute/service'

const attributeService = new AttributeService()

type AttributeLine = { attributeId: string; valueIds: string[] }

type ResolvedAxis = {
	attributeId: string
	attributeName: string
	values: Array<{ valueId: string; value: string }>
}

export class ProductVariantService {
	private repository: ProductVariantRepository

	constructor() {
		this.repository = new ProductVariantRepository()
	}

	async findByProduct(productId: string) {
		return this.repository.findByProduct(productId)
	}

	/**
	 * Resolves attribute lines (attributeId + selected valueIds) into named axes ready for the
	 * cartesian-product variant generator, by hydrating each Attribute and filtering to the
	 * selected values.
	 */
	private async resolveAxes(attributeLines: AttributeLine[]): Promise<ResolvedAxis[]> {
		if (!attributeLines?.length) return []
		const attrs = await attributeService.findByIds(attributeLines.map((l) => l.attributeId))
		const byId = new Map(attrs.map((a: any) => [String(a._id), a]))
		const axes: ResolvedAxis[] = []
		for (const line of attributeLines) {
			const attr = byId.get(String(line.attributeId))
			if (!attr) continue
			const selected = new Set(line.valueIds.map(String))
			const values = ((attr as any).values ?? [])
				.filter((v: any) => selected.has(String(v._id)))
				.map((v: any) => ({ valueId: String(v._id), value: v.value }))
			if (values.length) {
				axes.push({ attributeId: String((attr as any)._id), attributeName: (attr as any).name, values })
			}
		}
		return axes
	}

	private cartesianProduct(axes: ResolvedAxis[]): Array<Array<{ attributeId: string; attributeName: string; valueId: string; value: string }>> {
		if (!axes.length) return []
		return axes.reduce<Array<Array<{ attributeId: string; attributeName: string; valueId: string; value: string }>>>(
			(acc, axis) => {
				const next: Array<Array<{ attributeId: string; attributeName: string; valueId: string; value: string }>> = []
				for (const combo of acc) {
					for (const v of axis.values) {
						next.push([...combo, { attributeId: axis.attributeId, attributeName: axis.attributeName, valueId: v.valueId, value: v.value }])
					}
				}
				return next
			},
			[[]],
		)
	}

	/**
	 * Regenerates variants for a product from its attribute lines. Existing variants are soft-deleted
	 * and replaced — this keeps generation idempotent and simple (Odoo instead diffs combinations,
	 * which is a reasonable future optimization if variant-level stock history needs preserving).
	 */
	async regenerateForProduct(
		productId: string,
		organizationId: string,
		productName: string,
		attributeLines: AttributeLine[],
	) {
		await this.repository.deleteAllForProduct(productId)
		const axes = await this.resolveAxes(attributeLines)
		const combos = this.cartesianProduct(axes)
		if (!combos.length) return []

		const created = []
		for (const combo of combos) {
			const suffix = combo.map((c) => c.value).join(', ')
			created.push(
				await this.repository.create({
					productId,
					displayName: `${productName} (${suffix})`,
					attributeValues: combo,
					isActive: true,
					organizationId,
				} as any),
			)
		}
		return created
	}

	async updateVariant(id: string, data: { sku?: string; barcode?: string; extraPrice?: number; isActive?: boolean }) {
		return this.repository.update(id, data as any)
	}

	async findById(id: string) {
		return this.repository.findById(id)
	}
}
