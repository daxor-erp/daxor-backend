import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLValidationError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { BOMService } from './service'

const service = new BOMService()

function iso(d: unknown): string | null {
	if (d == null) return null
	const t = new Date(d as string | number | Date).getTime()
	if (Number.isNaN(t)) return null
	return new Date(t).toISOString()
}

export const resolvers = {
	Query: {
		billOfMaterials: async (_: unknown, { id }: { id: string }) => service.findById(id),
		billsOfMaterials: async (
			_: unknown,
			{ organizationId, status, parentItemId, search }: any,
			ctx: GraphQLContext,
		) => {
			assertAuthenticated(ctx)
			return service.list(organizationId, { status, parentItemId, search })
		},
	},
	Mutation: {
		createBillOfMaterials: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.create(input)
		},
		updateBillOfMaterials: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const updated = await service.update(id, input)
			if (!updated) throw new GraphQLValidationError('Bill of Materials not found')
			return updated
		},
		deleteBillOfMaterials: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const deleted = await service.softDelete(id)
			if (!deleted) throw new GraphQLValidationError('Bill of Materials not found')
			return deleted
		},
	},
	BillOfMaterials: {
		id: (p: any) => String(p?._id ?? p?.id ?? ''),
		organizationId: (p: any) => String(p.organizationId ?? ''),
		parentItemId: (p: any) => String(p.parentItemId ?? ''),
		unit: (p: any) => p.unit ?? 'unit',
		quantityProduced: (p: any) => Number(p.quantityProduced ?? 1),
		laborCost: (p: any) => Number(p.laborCost ?? 0),
		overheadCost: (p: any) => Number(p.overheadCost ?? 0),
		totalMaterialCost: (p: any) => Number(p.totalMaterialCost ?? 0),
		totalCost: (p: any) => Number(p.totalCost ?? 0),
		status: (p: any) => p.status ?? 'DRAFT',
		components: (p: any) =>
			(p.components ?? []).map((c: any) => ({
				itemId: c.itemId != null ? String(c.itemId) : null,
				itemName: c.itemName ?? '',
				quantity: Number(c.quantity ?? 0),
				unit: c.unit ?? 'unit',
				scrapPercent: Number(c.scrapPercent ?? 0),
				standardCost: Number(c.standardCost ?? 0),
				notes: c.notes ?? null,
			})),
		createdAt: (p: any) => iso(p.createdAt) ?? '',
		updatedAt: (p: any) => iso(p.updatedAt) ?? '',
	},
}
