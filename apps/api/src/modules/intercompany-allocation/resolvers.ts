import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLValidationError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { IntercompanyAllocationService } from './service'

const service = new IntercompanyAllocationService()

function iso(d: unknown): string | null {
	if (d == null) return null
	const t = new Date(d as string | number | Date).getTime()
	if (Number.isNaN(t)) return null
	return new Date(t).toISOString()
}

export const resolvers = {
	Query: {
		intercompanyAllocation: async (_: unknown, { id }: { id: string }) => service.findById(id),
		intercompanyAllocations: async (_: unknown, { organizationId, status, search }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.list(organizationId, { status, search })
		},
	},
	Mutation: {
		createIntercompanyAllocation: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.create(input)
		},
		updateIntercompanyAllocation: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const updated = await service.update(id, input)
			if (!updated) throw new GraphQLValidationError('Allocation schedule not found')
			return updated
		},
		deleteIntercompanyAllocation: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const deleted = await service.softDelete(id)
			if (!deleted) throw new GraphQLValidationError('Allocation schedule not found')
			return deleted
		},
		postIntercompanyAllocation: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.post(id, ctx.user!.id)
		},
		reverseIntercompanyAllocation: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.reverse(id)
		},
	},
	IntercompanyAllocation: {
		id: (p: any) => String(p?._id ?? p?.id ?? ''),
		organizationId: (p: any) => String(p.organizationId ?? ''),
		journalEntryId: (p: any) => (p.journalEntryId != null ? String(p.journalEntryId) : null),
		postedByUserId: (p: any) => (p.postedByUserId != null ? String(p.postedByUserId) : null),
		basisDate: (p: any) => iso(p.basisDate) ?? '',
		postedAt: (p: any) => iso(p.postedAt),
		allocationMethod: (p: any) => p.allocationMethod ?? 'FIXED_PERCENT',
		status: (p: any) => p.status ?? 'DRAFT',
		lines: (p: any) => (p.lines ?? []).map((l: any) => ({
			targetOrganizationId: String(l.targetOrganizationId ?? ''),
			targetOrganizationName: l.targetOrganizationName ?? null,
			percentage: Number(l.percentage ?? 0),
			amount: Number(l.amount ?? 0),
			costCenter: l.costCenter ?? null,
			notes: l.notes ?? null,
		})),
		totalAllocated: (p: any) => Number(p.totalAllocated ?? 0),
		createdAt: (p: any) => iso(p.createdAt) ?? '',
		updatedAt: (p: any) => iso(p.updatedAt) ?? '',
	},
}
