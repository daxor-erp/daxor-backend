import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLValidationError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { IntercompanyJournalService } from './service'

const service = new IntercompanyJournalService()

function iso(d: unknown): string | null {
	if (d == null) return null
	const t = new Date(d as string | number | Date).getTime()
	if (Number.isNaN(t)) return null
	return new Date(t).toISOString()
}

export const resolvers = {
	Query: {
		intercompanyJournalEntry: async (_: unknown, { id }: { id: string }) => service.findById(id),
		intercompanyJournalEntries: async (_: unknown, { originatingOrganizationId, status, allocationId, search }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.list(originatingOrganizationId, { status, allocationId, search })
		},
	},
	Mutation: {
		createIntercompanyJournalEntry: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.create(input)
		},
		updateIntercompanyJournalEntry: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const updated = await service.update(id, input)
			if (!updated) throw new GraphQLValidationError('Journal entry not found')
			return updated
		},
		deleteIntercompanyJournalEntry: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const deleted = await service.softDelete(id)
			if (!deleted) throw new GraphQLValidationError('Journal entry not found')
			return deleted
		},
		postIntercompanyJournalEntry: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.post(id, ctx.user!.id)
		},
		reverseIntercompanyJournalEntry: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.reverse(id, ctx.user!.id)
		},
	},
	IntercompanyJournalEntry: {
		id: (p: any) => String(p?._id ?? p?.id ?? ''),
		originatingOrganizationId: (p: any) => String(p.originatingOrganizationId ?? ''),
		allocationId: (p: any) => (p.allocationId != null ? String(p.allocationId) : null),
		reversalOfId: (p: any) => (p.reversalOfId != null ? String(p.reversalOfId) : null),
		postedByUserId: (p: any) => (p.postedByUserId != null ? String(p.postedByUserId) : null),
		entryDate: (p: any) => iso(p.entryDate) ?? '',
		postedAt: (p: any) => iso(p.postedAt),
		status: (p: any) => p.status ?? 'DRAFT',
		totalDebit: (p: any) => Number(p.totalDebit ?? 0),
		totalCredit: (p: any) => Number(p.totalCredit ?? 0),
		lines: (p: any) => (p.lines ?? []).map((l: any) => ({
			organizationId: String(l.organizationId ?? ''),
			account: l.account ?? '',
			accountName: l.accountName ?? null,
			costCenter: l.costCenter ?? null,
			debit: Number(l.debit ?? 0),
			credit: Number(l.credit ?? 0),
			description: l.description ?? null,
		})),
		createdAt: (p: any) => iso(p.createdAt) ?? '',
		updatedAt: (p: any) => iso(p.updatedAt) ?? '',
	},
}
