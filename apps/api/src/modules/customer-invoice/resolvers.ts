import { CustomerInvoiceService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLAuthError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { ApprovalRequestService } from '../approval-request/service'

const service = new CustomerInvoiceService()
const approvalService = new ApprovalRequestService()

export const resolvers = {
	Query: {
		customerinvoice: async (_: unknown, { id }: { id: string }) => service.findById(id),
		customerinvoices: async (_: unknown, args: any) => {
			const { organizationId, page = 1, limit = 10, status, search, customerId } = args
			const filter: any = { organizationId, deletedAt: null }
			if (status) filter.status = status
			if (customerId && search) {
				filter.$and = [
					{ $or: [{ customerId }, { clientId: customerId }] },
					{
						$or: [
							{ invoiceNumber: { $regex: search, $options: 'i' } },
							{ seqNo: { $regex: search, $options: 'i' } },
						],
					},
				]
			} else if (customerId) {
				filter.$or = [{ customerId }, { clientId: customerId }]
			} else if (search) {
				filter.$or = [
					{ invoiceNumber: { $regex: search, $options: 'i' } },
					{ seqNo: { $regex: search, $options: 'i' } },
				]
			}
			const result = await service.findWithPagination(filter, { page, limit, sortBy: 'createdAt', sortOrder: 'desc' })
			return result.data
		},
	},
	Mutation: {
		createCustomerInvoice: async (_: unknown, { input }: any, ctx: GraphQLContext) => 
			service.create({ ...input, createdBy: ctx.user?.id }),
		updateCustomerInvoice: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => 
			service.update(id, {
				...input,
				...(input.customerId ? { clientId: input.customerId } : {}),
				updatedBy: ctx.user?.id,
			}),
		submitCustomerInvoiceForApproval: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const before = await service.findById(id)
			if (!before || (before as any).deletedAt) throw new GraphQLAuthError('Invoice not found')
			await approvalService.ensureApproverConfigured(String((before as any).organizationId), 'sales')
			await service.submitForApproval(id, ctx.user!.id)
			await approvalService.enqueueCustomerInvoiceSubmitted(id, ctx.user!.id)
			return service.findById(id)
		},
		deleteCustomerInvoice: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => 
			service.update(id, { deletedAt: new Date(), deletedBy: ctx.user?.id }),
	},
	CustomerInvoice: {
		seqNo: (parent: any) => String(parent.seqNo ?? parent.invoiceNumber ?? parent._id ?? ''),
		customerId: (parent: any) => String(parent.customerId ?? parent.clientId ?? ''),
		organizationId: (parent: any) => String(parent.organizationId ?? ''),
		salesOrderId: (parent: any) => (parent.salesOrderId != null ? String(parent.salesOrderId) : null),
		outstandingAmount: (parent: any) => {
			const total = Number(parent.totalAmount ?? 0)
			const paid = Number(parent.paidAmount ?? 0)
			return Math.max(0, Math.round((total - paid) * 100) / 100)
		},
		invoiceDate: (parent: any) =>
			parent.invoiceDate
				? new Date(parent.invoiceDate).toISOString()
				: new Date(0).toISOString(),
		dueDate: (parent: any) =>
			parent.dueDate ? new Date(parent.dueDate).toISOString() : null,
		createdAt: (parent: any) =>
			parent.createdAt
				? new Date(parent.createdAt).toISOString()
				: new Date(0).toISOString(),
	},
}
