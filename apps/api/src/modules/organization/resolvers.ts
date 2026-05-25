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
import { collectApproverUserIdsFromOrgRow, uniqApproverIds } from '~/helpers/approval-workflow'

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
		subTenants: async (_: unknown, { parentOrganizationId }: { parentOrganizationId: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			if (isPlatformAdmin(ctx)) return service.findChildren(parentOrganizationId)
			const my = orgIdString(ctx)
			if (!my || String(my) !== String(parentOrganizationId)) {
				throw new GraphQLAuthError('You can only list sub-tenants of your own organization')
			}
			return service.findChildren(parentOrganizationId)
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
		createSubTenantWithAdmin: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			if (!isOrgAdmin(ctx) && !isPlatformAdmin(ctx)) {
				throw new GraphQLAuthError('Only an organization admin can create sub-tenants')
			}
			const parentId = orgIdString(ctx)
			if (!parentId) throw new GraphQLAuthError('No parent organization in context')
			const parent = await service.findById(parentId)
			if (!parent || parent.deletedAt) throw new GraphQLValidationError('Parent organization not found')
			if (!parent.allowSubTenants) {
				throw new GraphQLAuthError('Sub-tenants are not enabled for your organization. Ask a platform admin to enable allowSubTenants.')
			}
			return service.createWithOrgAdmin(input, ctx.user!.id, parentId)
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
				// ORG_ADMIN cannot flip status or allowSubTenants on themselves
				const { status: _st, allowSubTenants: _ast, ...safe } = input
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
			}: {
				organizationId: string
				assignments: {
					moduleKey: string
					approverUserId?: string | null
					approverUserIds?: string[] | null
				}[]
			},
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

			const mergedIds = new Map<string, string[]>()

			for (const row of assignments) {
				const key = String(row.moduleKey || '').trim()
				if (!key) continue

				let ids: string[]
				if (row.approverUserIds != null) {
					ids = uniqApproverIds(row.approverUserIds.map((x: unknown) => String(x ?? '')))
				} else if (row.approverUserId == null || row.approverUserId === '') {
					ids = []
				} else {
					ids = [String(row.approverUserId)]
				}

				mergedIds.set(key, ids)
			}

			for (const idList of mergedIds.values()) {
				for (const uid of idList) {
					const u = await userService.findById(uid)
					if (!u || u.deletedAt || String(u.organizationId) !== String(organizationId)) {
						throw new GraphQLValidationError(
							'Each approver must be an active user in this organization.',
						)
					}
				}
			}

			const moduleApprovers = [...mergedIds.entries()].map(([moduleKey, ids]) => {
				const uniq = uniqApproverIds(ids)
				return {
					moduleKey,
					approverUserIds: uniq,
					approverUserId: uniq[0] ?? null,
				}
			})

			const updated = await service.update(organizationId, { moduleApprovers, updatedAt: new Date() })
			if (!updated) throw new GraphQLAuthError('Organization not found')
			return updated
		},
	},
	Organization: {
		id: (p: { _id?: unknown; id?: string }) => String(p?._id ?? p?.id ?? ''),
		seqNo: (p: { seqNo?: string }) => p?.seqNo ?? '',
		parentOrganizationId: (p: { parentOrganizationId?: unknown }) =>
			p?.parentOrganizationId != null ? String(p.parentOrganizationId) : null,
		allowSubTenants: (p: { allowSubTenants?: boolean }) => Boolean(p?.allowSubTenants),
		moduleApprovers: (
			parent: { moduleApprovers?: { moduleKey?: string; approverUserId?: unknown; approverUserIds?: unknown }[] },
		) => {
			const rows = Array.isArray(parent.moduleApprovers) ? parent.moduleApprovers : []
			return rows.filter((r) => r?.moduleKey).map((r) => {
				const ids = collectApproverUserIdsFromOrgRow(r)
				const first = ids[0]
				return {
					moduleKey: String(r.moduleKey),
					approverUserIds: ids,
					approverUserId: first ?? (r.approverUserId != null ? String(r.approverUserId) : null),
				}
			})
		},
		createdAt: (p: { createdAt?: unknown }) => iso(p?.createdAt) ?? '',
	},
}
