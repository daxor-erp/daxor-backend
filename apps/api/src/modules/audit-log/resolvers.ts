import type { GraphQLContext } from '~/types/graphql.context'
import { assertAuthenticated } from '../auth/authz'
import { AuditLogService } from './service'

const service = new AuditLogService()

function iso(d: unknown): string | null {
	if (d == null) return null
	const t = new Date(d as string | number | Date).getTime()
	if (Number.isNaN(t)) return null
	return new Date(t).toISOString()
}

function safeJson(v: unknown): string | null {
	if (v == null) return null
	try {
		return JSON.stringify(v)
	} catch {
		return null
	}
}

export const resolvers = {
	Query: {
		auditLogs: async (
			_: unknown,
			{
				entityType,
				entityId,
				userId,
				action,
				page = 1,
				limit = 50,
			}: {
				entityType?: string
				entityId?: string
				userId?: string
				action?: string
				page?: number
				limit?: number
			},
			ctx: GraphQLContext,
		) => {
			assertAuthenticated(ctx)
			const filter: Record<string, unknown> = {}
			if (entityType) filter.entityType = entityType
			if (entityId) filter.entityId = entityId
			if (userId) filter.userId = userId
			if (action) filter.action = action
			const res = await service.findWithPagination(filter, {
				page: Math.max(1, page),
				limit: Math.max(1, Math.min(200, limit)),
				sortBy: 'createdAt',
				sortOrder: 'desc',
			})
			return res
		},
	},
	AuditLog: {
		id: (p: any) => String(p?._id ?? p?.id ?? ''),
		userId: (p: any) => (p.userId != null ? String(p.userId) : null),
		entityId: (p: any) => (p.entityId != null ? String(p.entityId) : null),
		entityType: (p: any) => p.entityType ?? '',
		action: (p: any) => p.action ?? '',
		oldValuesJson: (p: any) => safeJson(p.oldValues),
		newValuesJson: (p: any) => safeJson(p.newValues),
		createdAt: (p: any) => iso(p.createdAt) ?? '',
	},
}
