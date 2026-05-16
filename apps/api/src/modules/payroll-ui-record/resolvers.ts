import { PayrollUiRecordService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLAuthError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { ApprovalRequestService } from '../approval-request/service'

const service = new PayrollUiRecordService()
const approvalService = new ApprovalRequestService()

function iso(d: unknown): string {
  if (d == null) return ''
  const t = new Date(d as string | number | Date).getTime()
  if (Number.isNaN(t)) return ''
  return new Date(t).toISOString()
}

function dataToString(d: unknown): string {
  if (d == null) return '{}'
  if (typeof d === 'string') return d
  try {
    return JSON.stringify(d)
  } catch {
    return '{}'
  }
}

const payrollUiRecordResolvers = {
  Query: {
    payrolluirecord: async (_: unknown, { id }: { id: string }) => {
      return service.getById(id)
    },
    payrolluirecords: async (
      _: unknown,
      { organizationId, category }: { organizationId: string; category: string },
    ) => {
      return service.getByOrgAndCategory(organizationId, category)
    },
  },
  Mutation: {
    createPayrollUiRecord: async (_: unknown, { input }: any, context: any) => {
      return service.create({
        organizationId: input.organizationId,
        category: input.category,
        code: input.code ?? undefined,
        data: input.data,
        userId: context.user?.id || 'system',
      })
    },
    updatePayrollUiRecord: async (_: unknown, { id, input }: any) => {
      return service.update(id, {
        organizationId: input.organizationId,
        category: input.category,
        code: input.code ?? undefined,
        data: input.data,
      })
    },
    deletePayrollUiRecord: async (_: unknown, { id }: { id: string }) => {
      await service.delete(id)
      return true
    },
    submitPayrollUiRecordForApproval: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      assertAuthenticated(ctx)
      const row = await service.getById(id)
      if (!row) throw new GraphQLAuthError('Record not found')
      await approvalService.ensureApproverConfigured(String((row as any).organizationId), 'payroll')
      await service.submitForApproval(id)
      await approvalService.enqueuePayrollUiRecordSubmitted(id, ctx.user!.id)
      return service.getById(id)
    },
  },
  PayrollUiRecord: {
    id: (p: { _id?: unknown; id?: string }) => String((p as any)._id ?? p.id),
    data: (p: { data?: unknown }) => dataToString(p.data),
    approvalStatus: (p: { approvalStatus?: string }) => String(p.approvalStatus ?? 'none'),
    createdAt: (p: { createdAt?: unknown }) => iso(p.createdAt),
    updatedAt: (p: { updatedAt?: unknown }) => iso(p.updatedAt),
  },
}

export const resolvers = payrollUiRecordResolvers
