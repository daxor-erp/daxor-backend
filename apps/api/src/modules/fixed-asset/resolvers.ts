import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLValidationError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { FixedAssetService } from './service'

const service = new FixedAssetService()

function iso(d: unknown): string | null {
	if (d == null) return null
	const t = new Date(d as string | number | Date).getTime()
	if (Number.isNaN(t)) return null
	return new Date(t).toISOString()
}

export const resolvers = {
	Query: {
		fixedAsset: async (_: unknown, { id }: { id: string }) => service.findById(id),
		fixedAssets: async (
			_: unknown,
			{ organizationId, status, category, search }: any,
		) => service.list(organizationId, { status, category, search }),
		fixedAssetSummaryByCategory: async (_: unknown, { organizationId }: any) => {
			const rows = await service.summaryByCategory(organizationId)
			return rows.map((r: any) => ({
				category: r._id ?? 'OTHER',
				count: r.count ?? 0,
				acquisitionCost: r.acquisitionCost ?? 0,
				accumulatedDepreciation: r.accumulatedDepreciation ?? 0,
				bookValue: r.bookValue ?? 0,
			}))
		},
	},
	Mutation: {
		createFixedAsset: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.create(input)
		},
		updateFixedAsset: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const updated = await service.update(id, input)
			if (!updated) throw new GraphQLValidationError('Fixed asset not found')
			return updated
		},
		deleteFixedAsset: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const deleted = await service.softDelete(id)
			if (!deleted) throw new GraphQLValidationError('Fixed asset not found')
			return deleted
		},
		postFixedAssetDepreciation: async (
			_: unknown,
			{ id, input }: { id: string; input: { periodEndDate: string; amount?: number; notes?: string } },
			ctx: GraphQLContext,
		) => {
			assertAuthenticated(ctx)
			return service.postDepreciation(id, input)
		},
		disposeFixedAsset: async (
			_: unknown,
			{ id, disposalDate, notes }: { id: string; disposalDate: string; notes?: string },
			ctx: GraphQLContext,
		) => {
			assertAuthenticated(ctx)
			return service.dispose(id, disposalDate, notes)
		},
	},
	FixedAsset: {
		id: (p: any) => String(p?._id ?? p?.id ?? ''),
		organizationId: (p: any) => String(p.organizationId ?? ''),
		assignedToUserId: (p: any) => (p.assignedToUserId != null ? String(p.assignedToUserId) : null),
		siteLocationId: (p: any) => (p.siteLocationId != null ? String(p.siteLocationId) : null),
		vendorId: (p: any) => (p.vendorId != null ? String(p.vendorId) : null),
		category: (p: any) => p.category ?? 'OTHER',
		status: (p: any) => p.status ?? 'ACTIVE',
		depreciationMethod: (p: any) => p.depreciationMethod ?? 'STRAIGHT_LINE',
		purchaseDate: (p: any) => iso(p.purchaseDate) ?? '',
		commissionedDate: (p: any) => iso(p.commissionedDate),
		disposalDate: (p: any) => iso(p.disposalDate),
		warrantyExpiryDate: (p: any) => iso(p.warrantyExpiryDate),
		depreciationHistory: (p: any) =>
			(p.depreciationHistory ?? []).map((e: any) => ({
				periodEndDate: iso(e.periodEndDate) ?? '',
				amount: Number(e.amount ?? 0),
				accumulatedDepreciation: Number(e.accumulatedDepreciation ?? 0),
				bookValue: Number(e.bookValue ?? 0),
				method: e.method ?? 'STRAIGHT_LINE',
				notes: e.notes ?? null,
				postedAt: iso(e.postedAt) ?? '',
			})),
		createdAt: (p: any) => iso(p.createdAt) ?? '',
		updatedAt: (p: any) => iso(p.updatedAt) ?? '',
	},
}
