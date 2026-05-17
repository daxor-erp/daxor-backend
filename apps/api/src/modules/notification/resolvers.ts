import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLAuthError, GraphQLValidationError } from '@repo/errors'
import { NotificationService, type NotificationKind, type NotificationSeverity } from './service'
import { assertAuthenticated, isOrgAdmin, isPlatformAdmin, orgIdString } from '../auth/authz'
import { UserService } from '../user/service'

const service = new NotificationService()
const userService = new UserService()

function iso(d: unknown): string | null {
	if (d == null) return null
	const t = new Date(d as string | number | Date).getTime()
	if (Number.isNaN(t)) return null
	return new Date(t).toISOString()
}

export const resolvers = {
	Query: {
		myNotifications: async (
			_: unknown,
			args: { unreadOnly?: boolean | null; limit?: number | null; skip?: number | null },
			ctx: GraphQLContext,
		) => {
			assertAuthenticated(ctx)
			return service.listForRecipient(ctx.user!.id, {
				unreadOnly: !!args.unreadOnly,
				limit: typeof args.limit === 'number' ? args.limit : undefined,
				skip: typeof args.skip === 'number' ? args.skip : undefined,
			})
		},
		myUnreadNotificationCount: async (_: unknown, __: unknown, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.countUnread(ctx.user!.id)
		},
	},
	Mutation: {
		markNotificationRead: async (
			_: unknown,
			{ id }: { id: string },
			ctx: GraphQLContext,
		) => {
			assertAuthenticated(ctx)
			const row = await service.markRead(id, ctx.user!.id)
			if (!row) throw new GraphQLValidationError('Notification not found')
			return row
		},
		markAllNotificationsRead: async (_: unknown, __: unknown, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.markAllRead(ctx.user!.id)
		},
		archiveNotification: async (
			_: unknown,
			{ id }: { id: string },
			ctx: GraphQLContext,
		) => {
			assertAuthenticated(ctx)
			const row = await service.archive(id, ctx.user!.id)
			if (!row) throw new GraphQLValidationError('Notification not found')
			return row
		},
		archiveAllNotifications: async (_: unknown, __: unknown, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.archiveAll(ctx.user!.id)
		},
		sendNotification: async (
			_: unknown,
			{ input }: { input: {
				kind: NotificationKind
				severity?: NotificationSeverity | null
				title: string
				message?: string | null
				link?: string | null
				audience: {
					userIds?: string[] | null
					allUsersInOrganizationId?: string | null
					allOrgAdmins?: boolean | null
				}
			} },
			ctx: GraphQLContext,
		) => {
			assertAuthenticated(ctx)
			const senderId = ctx.user!.id
			const platform = isPlatformAdmin(ctx)
			const orgAdminOnly = isOrgAdmin(ctx) && !platform
			if (!platform && !orgAdminOnly) {
				throw new GraphQLAuthError('Forbidden')
			}
			const { audience } = input
			const setCount = [audience.userIds?.length, audience.allUsersInOrganizationId, audience.allOrgAdmins ? 1 : null].filter((v) => v != null && v !== 0).length
			if (setCount !== 1) {
				throw new GraphQLValidationError('Set exactly one audience field: userIds, allUsersInOrganizationId, or allOrgAdmins')
			}

			// Resolve recipient set
			let recipients: { recipientUserId: string; organizationId: string }[] = []
			if (audience.allOrgAdmins) {
				if (!platform) throw new GraphQLAuthError('Only platform admins can broadcast to all org admins')
				const admins = await userService.findByRole('ORG_ADMIN')
				recipients = admins
					.filter((u: any) => u.organizationId)
					.map((u: any) => ({ recipientUserId: String(u._id ?? u.id), organizationId: String(u.organizationId) }))
			} else if (audience.allUsersInOrganizationId) {
				const targetOrg = String(audience.allUsersInOrganizationId)
				if (orgAdminOnly && targetOrg !== orgIdString(ctx)) {
					throw new GraphQLAuthError('Org admins can only broadcast within their own organization')
				}
				const users = await userService.findWithPagination(
					{ organizationId: targetOrg, deletedAt: null, status: 'active' },
					{ page: 1, limit: 1000, sortBy: 'createdAt', sortOrder: 'desc' },
				)
				const list: any[] = users?.data ?? users ?? []
				recipients = list
					.filter((u: any) => String(u._id ?? u.id) !== senderId)
					.map((u: any) => ({ recipientUserId: String(u._id ?? u.id), organizationId: targetOrg }))
			} else if (audience.userIds?.length) {
				for (const id of audience.userIds) {
					const u = await userService.findById(String(id))
					if (!u || u.deletedAt) continue
					if (orgAdminOnly && String(u.organizationId) !== orgIdString(ctx)) {
						throw new GraphQLAuthError(`Cannot target user ${id} outside your organization`)
					}
					recipients.push({ recipientUserId: String(u._id ?? u.id), organizationId: String(u.organizationId ?? '') })
				}
			}

			const kind = input.kind
			const severity = input.severity ?? (kind === 'ALERT' ? 'DANGER' : kind === 'MAINTENANCE' ? 'WARNING' : 'INFO')
			let sent = 0
			for (const r of recipients) {
				if (!r.organizationId) continue
				const created = await service.notify({
					organizationId: r.organizationId,
					recipientUserId: r.recipientUserId,
					actorUserId: senderId,
					kind,
					severity,
					title: input.title,
					message: input.message ?? undefined,
					link: input.link ?? undefined,
				})
				if (created) sent++
			}
			return sent
		},
	},
	Notification: {
		id: (p: { _id?: unknown; id?: string }) => String(p?._id ?? p?.id ?? ''),
		organizationId: (p: { organizationId?: unknown }) => String(p.organizationId ?? ''),
		recipientUserId: (p: { recipientUserId?: unknown }) => String(p.recipientUserId ?? ''),
		actorUserId: (p: { actorUserId?: unknown }) => (p.actorUserId != null ? String(p.actorUserId) : null),
		referenceId: (p: { referenceId?: unknown }) => (p.referenceId != null ? String(p.referenceId) : null),
		isRead: (p: { isRead?: boolean }) => !!p.isRead,
		readAt: (p: { readAt?: unknown }) => iso(p.readAt),
		archivedAt: (p: { archivedAt?: unknown }) => iso(p.archivedAt),
		createdAt: (p: { createdAt?: unknown }) => iso(p.createdAt) ?? '',
		updatedAt: (p: { updatedAt?: unknown }) => iso(p.updatedAt) ?? '',
	},
}
