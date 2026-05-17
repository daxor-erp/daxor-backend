import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLValidationError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { HrMasterService } from './service'

const service = new HrMasterService()

function iso(d: unknown): string | null {
	if (d == null) return null
	const t = new Date(d as string | number | Date).getTime()
	if (Number.isNaN(t)) return null
	return new Date(t).toISOString()
}

function parseMetadata(raw?: string | null): Record<string, unknown> {
	if (!raw) return {}
	try {
		const parsed = JSON.parse(raw)
		return typeof parsed === 'object' && parsed !== null ? parsed : {}
	} catch {
		return {}
	}
}

export const resolvers = {
	Query: {
		hrMaster: async (_: unknown, { id }: { id: string }) => service.findById(id),
		hrMasters: async (_: unknown, { organizationId, kind, active, search }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.list(organizationId, kind, { active: typeof active === 'boolean' ? active : undefined, search })
		},
	},
	Mutation: {
		createHrMaster: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const { metadataJson, ...rest } = input
			return service.create({ ...rest, metadata: parseMetadata(metadataJson) })
		},
		updateHrMaster: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const { metadataJson, ...rest } = input
			const patch: Record<string, unknown> = { ...rest }
			if (typeof metadataJson === 'string') patch.metadata = parseMetadata(metadataJson)
			const updated = await service.update(id, patch as any)
			if (!updated) throw new GraphQLValidationError('Master not found')
			return updated
		},
		deleteHrMaster: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const deleted = await service.softDelete(id)
			if (!deleted) throw new GraphQLValidationError('Master not found')
			return deleted
		},
	},
	HrMaster: {
		id: (p: any) => String(p?._id ?? p?.id ?? ''),
		organizationId: (p: any) => String(p.organizationId ?? ''),
		active: (p: any) => !!p.active,
		sortOrder: (p: any) => Number(p.sortOrder ?? 0),
		metadataJson: (p: any) => {
			try {
				return JSON.stringify(p.metadata ?? {})
			} catch {
				return '{}'
			}
		},
		createdAt: (p: any) => iso(p.createdAt) ?? '',
		updatedAt: (p: any) => iso(p.updatedAt) ?? '',
	},
}
