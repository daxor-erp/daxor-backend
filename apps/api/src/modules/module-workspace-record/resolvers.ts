import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLAuthError, GraphQLValidationError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { ModuleWorkspaceRecordService } from './service'
import { ApprovalRequestService } from '../approval-request/service'

function iso(d: unknown): string {
	if (d == null) return ''
	const t = new Date(d as string | number | Date).getTime()
	if (Number.isNaN(t)) return ''
	return new Date(t).toISOString()
}

function gqlStatus(raw: unknown): string {
	const s = String(raw ?? '').toUpperCase()
	if (s === 'DRAFT') return 'DRAFT'
	if (s === 'PENDING_APPROVAL') return 'PENDING_APPROVAL'
	if (s === 'APPROVED') return 'APPROVED'
	if (s === 'REJECTED') return 'REJECTED'
	switch (String(raw ?? '')) {
		case 'draft':
			return 'DRAFT'
		case 'pending_approval':
			return 'PENDING_APPROVAL'
		case 'approved':
			return 'APPROVED'
		case 'rejected':
			return 'REJECTED'
		default:
			return 'DRAFT'
	}
}

function snapshotOut(p: { snapshot?: unknown }): string {
	if (p?.snapshot == null) return ''
	if (typeof p.snapshot === 'string') return p.snapshot
	try {
		return JSON.stringify(p.snapshot)
	} catch {
		return ''
	}
}

function parseSnapshot(snapshot: unknown): unknown {
	if (snapshot == null || snapshot === '') return undefined
	if (typeof snapshot !== 'string') return snapshot
	try {
		return JSON.parse(snapshot)
	} catch {
		return snapshot
	}
}

const svc = new ModuleWorkspaceRecordService()
const approvalSvc = new ApprovalRequestService()

function assertSameOrg(ctx: GraphQLContext, organizationId: string) {
	assertAuthenticated(ctx)
	const cid = ctx.user?.organizationId
	if (cid == null || String(cid) !== String(organizationId)) {
		throw new GraphQLAuthError('Forbidden')
	}
}

export const resolvers = {
	Query: {
		moduleWorkspaceRecords: async (
			_: unknown,
			args: { organizationId: string; routePath: string; page?: number; limit?: number },
			ctx: GraphQLContext,
		) => {
			assertSameOrg(ctx, args.organizationId)
			const rawPath = args.routePath?.trim() ?? ''
			if (!rawPath) return []
			const limit = Math.min(Math.max(args.limit ?? 100, 1), 500)
			return svc.listForRoute(args.organizationId, rawPath, limit)
		},
	},
	Mutation: {
		createModuleWorkspaceRecord: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			assertSameOrg(ctx, input.organizationId)
			const title = String(input.title ?? '').trim()
			if (!title) throw new GraphQLValidationError('Title is required.')
			const routePath = String(input.routePath ?? '').trim()
			if (!routePath) throw new GraphQLValidationError('routePath is required.')
			const approvalModuleKey = String(input.approvalModuleKey ?? '').trim().toLowerCase()
			if (!approvalModuleKey) throw new GraphQLValidationError('approvalModuleKey is required.')
			const created = await svc.create({
				organizationId: input.organizationId,
				routePath,
				approvalModuleKey,
				title,
				detail: input.detail ?? undefined,
				snapshot: parseSnapshot(input.snapshot),
				userId: ctx.user?.id,
			})
			return created
		},
		updateModuleWorkspaceRecord: async (
			_: unknown,
			args: { id: string; title?: string | null; detail?: string | null; snapshot?: string | null },
			ctx: GraphQLContext,
		) => {
			assertAuthenticated(ctx)
			const existing = await svc.findById(args.id)
			if (!existing || existing.deletedAt) throw new GraphQLValidationError('Record not found.')
			assertSameOrg(ctx, String(existing.organizationId))
			if (!['draft', 'rejected'].includes(String(existing.status ?? ''))) {
				throw new GraphQLValidationError('Only draft or rejected records can be edited.')
			}
			const patch: Parameters<ModuleWorkspaceRecordService['updateFields']>[1] = {
				updatedByUserId: ctx.user?.id,
			}
			if (args.title != null) {
				const t = String(args.title).trim()
				if (!t) throw new GraphQLValidationError('Title cannot be empty.')
				patch.title = t
			}
			if (args.detail !== undefined) patch.detail = args.detail ?? null
			if (args.snapshot !== undefined) patch.snapshot = parseSnapshot(args.snapshot)
			await svc.updateFields(args.id, patch)
			return svc.findById(args.id)
		},
		submitModuleWorkspaceRecordForApproval: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const row = await svc.findById(id)
			if (!row || row.deletedAt) throw new GraphQLValidationError('Record not found.')
			assertSameOrg(ctx, String(row.organizationId))
			if (!['draft', 'rejected'].includes(String(row.status ?? ''))) {
				throw new GraphQLValidationError('Only draft or rejected records can be sent for approval.')
			}
			const prevStatus = String(row.status ?? 'draft') as 'draft' | 'rejected'
			await approvalSvc.ensureApproverConfigured(String(row.organizationId), String(row.approvalModuleKey))
			try {
				await svc.markPendingApproval(id, ctx.user?.id)
				await approvalSvc.enqueueModuleWorkspaceRecord(id, ctx.user!.id)
			} catch (e) {
				await svc.setStatus(id, prevStatus === 'rejected' ? 'rejected' : 'draft', ctx.user?.id)
				throw e
			}
			return svc.findById(id)
		},
	},
	ModuleWorkspaceRecord: {
		id: (p: { _id?: unknown; id?: string }) => String(p?._id ?? p?.id ?? ''),
		organizationId: (p: { organizationId?: unknown }) => String(p.organizationId ?? ''),
		routePath: (p: { routePath?: string }) => p.routePath ?? '',
		approvalModuleKey: (p: { approvalModuleKey?: string }) => p.approvalModuleKey ?? '',
		title: (p: { title?: string }) => p.title ?? '',
		detail: (p: { detail?: string }) => p.detail ?? null,
		snapshot: (p: { snapshot?: unknown }) => snapshotOut(p),
		status: (p: { status?: string }) => gqlStatus(p.status),
		createdByUserId: (p: { createdByUserId?: unknown }) =>
			p.createdByUserId != null ? String(p.createdByUserId) : null,
		createdAt: (p: { createdAt?: unknown }) => iso(p.createdAt) ?? '',
		updatedAt: (p: { updatedAt?: unknown }) => iso(p.updatedAt) ?? '',
	},
}
