import { VendorService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLAuthError, GraphQLValidationError } from '@repo/errors'
import { assertAuthenticated, orgIdString } from '../auth/authz'
import {
	ApprovalRequestService,
	MODULE_KEY_VENDORS,
	APPROVAL_ENTITY_VENDOR,
} from '../approval-request/service'
import { OrganizationService } from '../organization/service'
import { UserService } from '../user/service'
import { approverIdsForModule, uniqApproverIds } from '~/helpers/approval-workflow'

const service = new VendorService()
const approvalService = new ApprovalRequestService()
const organizationService = new OrganizationService()
const userService = new UserService()

export const resolvers = {
	Query: {
		vendor: async (_: unknown, { id }: { id: string }) => service.getVendorById(id),

		vendors: async (_: unknown, args: any) => {
			const { organizationId, page = 1, limit = 100, status, search } = args
			const filter: any = { organizationId }
			if (status) filter.status = status
			if (search)
				filter.$or = [
					{ name: { $regex: search, $options: 'i' } },
					{ email: { $regex: search, $options: 'i' } },
					{ contactPerson: { $regex: search, $options: 'i' } },
				]
			return service.getAllVendors(filter, page, limit)
		},

		vendorEligibleApprovers: async (
			_: unknown,
			{ organizationId }: { organizationId: string },
			ctx: GraphQLContext,
		) => {
			assertAuthenticated(ctx)
			const oid = orgIdString(ctx)
			if (!oid || String(organizationId) !== String(oid)) {
				throw new GraphQLAuthError('Forbidden')
			}
			const org = await organizationService.findById(organizationId)
			if (!org || org.deletedAt) throw new GraphQLAuthError('Organization not found')
			const ids = approverIdsForModule(org as { moduleApprovers?: unknown[] }, MODULE_KEY_VENDORS)
			if (!ids.length) return []
			const users = await Promise.all(ids.map((uid) => userService.findById(uid)))
			return users.filter((u: unknown) => u && !(u as { deletedAt?: unknown }).deletedAt)
		},

		vendorApprovalRequests: async (
			_: unknown,
			{ vendorId, limit }: { vendorId: string; limit?: number | null },
			ctx: GraphQLContext,
		) => {
			assertAuthenticated(ctx)
			const row = await service.getVendorById(vendorId)
			if (!row || (row as { deletedAt?: unknown }).deletedAt) throw new GraphQLAuthError('Vendor not found')
			const ctxOrg = ctx.user?.organizationId
			const orgCell = row as { organizationId?: unknown }
			if (ctxOrg == null || String(ctxOrg) !== String(orgCell.organizationId)) {
				throw new GraphQLAuthError('Forbidden')
			}
			return approvalService.listApprovalRequestsForEntity(
				APPROVAL_ENTITY_VENDOR,
				vendorId,
				limit ?? 50,
			)
		},
	},

	Mutation: {
		createVendor: async (_: unknown, { input }: any, ctx: GraphQLContext) =>
			service.createVendor(input, ctx.user?.id ?? ''),

		updateVendor: async (_: unknown, { id, input }: any, ctx: GraphQLContext) =>
			service.updateVendor(id, input, ctx.user?.id ?? ''),

		deleteVendor: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			await service.deleteVendor(id, ctx.user?.id ?? '')
			return true
		},

		submitVendorForApproval: async (
			_: unknown,
			args: { id: string; assigneeApproverUserIds?: string[] | null },
			ctx: GraphQLContext,
		) => {
			assertAuthenticated(ctx)
			const { id, assigneeApproverUserIds } = args

			const row = await service.getVendorById(id)
			if (!row || (row as { deletedAt?: unknown }).deletedAt) throw new GraphQLAuthError('Vendor not found')
			const ctxOrg = ctx.user?.organizationId
			const rowOrgId = String((row as { organizationId?: unknown }).organizationId ?? '')
			if (ctxOrg == null || String(ctxOrg) !== rowOrgId) {
				throw new GraphQLAuthError('Forbidden')
			}

			await approvalService.ensureApproverConfigured(rowOrgId, MODULE_KEY_VENDORS)

			const org = await organizationService.findById(rowOrgId)
			if (!org || org.deletedAt) throw new GraphQLAuthError('Organization not found')

			const assignees =
				assigneeApproverUserIds != null
					? uniqApproverIds(assigneeApproverUserIds)
					: approverIdsForModule(org as { moduleApprovers?: unknown[] }, MODULE_KEY_VENDORS)

			if (!assignees.length) {
				throw new GraphQLValidationError(
					'No vendors approvers are configured. Org admins can assign users under Administration → Approvals → Vendors.',
				)
			}

			await service.submitForOrgApproval(id, ctx.user!.id)
			try {
				await approvalService.enqueueVendorSubmittedWithApproverSelection(id, ctx.user!.id, assignees)
			} catch (err) {
				await service.revertSubmissionAfterEnqueueFailure(id, ctx.user!.id)
				throw err
			}
			return service.getVendorById(id)
		},
	},

	Vendor: {
		id: (parent: { _id?: unknown; id?: string }) => parent._id || parent.id,
		orgApprovalStatus: (parent: { orgApprovalStatus?: string }) => parent.orgApprovalStatus ?? 'approved',
		createdBy: async (parent: { createdBy?: unknown }) => {
			const cid = parent?.createdBy
			if (!cid) return null
			return userService.findById(String(cid))
		},
	},
}
