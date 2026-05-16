import { OrganizationService } from './service'
import { UserService } from '../user/service'
import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLAuthError, GraphQLValidationError } from '@repo/errors'
import {
	assertAuthenticated,
	assertPlatformAdmin,
	isOrgAdmin,
	isPlatformAdmin,
	orgIdString,
} from '../auth/authz'

const service = new OrganizationService()
const userService = new UserService()

function iso(d: unknown): string | null {
	if (d == null) return null
	const t = new Date(d as string | number | Date).getTime()
	if (Number.isNaN(t)) return null
	return new Date(t).toISOString()
}

export const resolvers = {
	Query: {
		organization: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const org = await service.findById(id)
			if (!org || org.deletedAt) {
				throw new GraphQLAuthError('Organization not found')
			}
			if (isPlatformAdmin(ctx)) return org
			const my = orgIdString(ctx)
			if (my && String(org._id) === String(my)) return org
			throw new GraphQLAuthError('Forbidden')
		},
		organizations: async (_: unknown, args: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const { page = 1, limit = 100, search, status } = args

			if (isPlatformAdmin(ctx)) {
				const filter: Record<string, unknown> = { deletedAt: null }
				if (status) filter.status = status
				if (search) filter.name = { $regex: search, $options: 'i' }
				const result = await service.findWithPagination(filter, {
					page,
					limit,
					sortBy: 'createdAt',
					sortOrder: 'desc',
				})
				return result.data
			}

			const oid = orgIdString(ctx)
			if (!oid) return []

			const o = await service.findById(oid)
			if (!o || o.deletedAt) return []
			if (search) {
				const q = String(search).toLowerCase()
				if (!String(o.name || '').toLowerCase().includes(q)) return []
			}
			if (status && String(o.status) !== String(status)) return []
			return [o]
		},
	},
	Mutation: {
		createOrganization: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			assertPlatformAdmin(ctx)
			return service.create({ ...input, createdBy: ctx.user?.id, status: 'active' })
		},
		createOrganizationWithOrgAdmin: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			assertPlatformAdmin(ctx)
			return service.createWithOrgAdmin(input, ctx.user!.id)
		},
		updateOrganization: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			if (isPlatformAdmin(ctx)) {
				return service.update(id, { ...input, updatedBy: ctx.user?.id })
			}
			if (isOrgAdmin(ctx)) {
				const oid = orgIdString(ctx)
				if (!oid || String(id) !== oid) {
					throw new GraphQLAuthError('You can only update your own organization')
				}
				const { status: _st, ...safe } = input
				return service.update(id, { ...safe, updatedBy: ctx.user?.id })
			}
			throw new GraphQLAuthError('Forbidden')
		},
		deleteOrganization: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertPlatformAdmin(ctx)
			return service.update(id, { deletedAt: new Date() })
		},
		setOrganizationModuleApprovers: async (
			_: unknown,
			{
				organizationId,
				assignments,
			}: { organizationId: string; assignments: { moduleKey: string; approverUserId?: string | null }[] },
			ctx: GraphQLContext,
		) => {
			assertAuthenticated(ctx)

			const org = await service.findById(organizationId)
			if (!org || org.deletedAt) throw new GraphQLAuthError('Organization not found')

			if (!isPlatformAdmin(ctx)) {
				if (!isOrgAdmin(ctx)) throw new GraphQLAuthError('Forbidden')
				const oid = orgIdString(ctx)
				if (!oid || String(organizationId) !== oid) throw new GraphQLAuthError('Forbidden')
			}

			const merged = new Map<string, string | null>()
			for (const row of assignments) {
				const key = String(row.moduleKey || '').trim()
				if (!key) continue
				const uid = row.approverUserId == null || row.approverUserId === '' ? null : String(row.approverUserId)
				if (uid) merged.set(key, uid)
				else merged.set(key, null)
			}

			for (const uid of merged.values()) {
				if (!uid) continue
				const u = await userService.findById(uid)
				if (!u || u.deletedAt || String(u.organizationId) !== String(organizationId)) {
					throw new GraphQLValidationError('Each approver must be an active user in this organization.')
				}
			}

			const moduleApprovers = [...merged.entries()].map(([moduleKey, approverUserId]) => ({
				moduleKey,
				...(approverUserId ? { approverUserId } : { approverUserId: null }),
			}))

			const updated = await service.update(organizationId, { moduleApprovers, updatedAt: new Date() })
			if (!updated) throw new GraphQLAuthError('Organization not found')
			return updated
		},
	},
	Organization: {
		id: (p: { _id?: unknown; id?: string }) => String(p?._id ?? p?.id ?? ''),
		seqNo: (p: { seqNo?: string }) => p?.seqNo ?? '',
		moduleApprovers: (
			parent: { moduleApprovers?: { moduleKey?: string; approverUserId?: unknown }[] },
		) => {
			const rows = Array.isArray(parent.moduleApprovers) ? parent.moduleApprovers : []
			return rows
				.filter((r) => r?.moduleKey)
				.map((r) => ({
					moduleKey: String(r.moduleKey),
					approverUserId: r.approverUserId != null ? String(r.approverUserId) : null,
				}))
		},
		createdAt: (p: { createdAt?: unknown }) => iso(p?.createdAt) ?? '',
	},
}
