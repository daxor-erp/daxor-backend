import { PayrollManagementService } from './service';
import { ApprovalRequestService, MODULE_KEY_PAYROLL } from '../approval-request/service';
import type { GraphQLContext } from '~/types/graphql.context';
import { GraphQLAuthError } from '@repo/errors';
import { assertAuthenticated } from '../auth/authz';

const service = new PayrollManagementService();
const approvalService = new ApprovalRequestService();

function iso(d: unknown): string | null {
  if (d == null) return null;
  const t = new Date(d as string | number | Date).getTime();
  if (Number.isNaN(t)) return null;
  return new Date(t).toISOString();
}

const payrollmanagementResolvers = {
  Query: {
    payrollmanagement: async (_: any, { id }: { id: string }) => {
      return service.getById(id);
    },
    payrollmanagements: async (_: any, { organizationId }: any) => {
      return service.getAll(organizationId);
    },
  },
  Mutation: {
    createPayrollManagement: async (_: any, { input }: any, context: GraphQLContext) => {
      return service.create(input, context.user?.id || 'system');
    },
    updatePayrollManagement: async (_: any, { id, input }: any) => {
      const { status: _ignoredStatus, ...rest } = input ?? {};
      return service.update(id, rest);
    },
    deletePayrollManagement: async (_: any, { id }: { id: string }) => {
      await service.delete(id);
      return true;
    },
    submitPayrollManagementForApproval: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      assertAuthenticated(ctx);
      const row = await service.getById(id);
      if (!row) throw new GraphQLAuthError('Payroll management record not found');
      const ctxOrg = ctx.user?.organizationId;
      if (ctxOrg == null || String(ctxOrg) !== String((row as any).organizationId)) {
        throw new GraphQLAuthError('Forbidden');
      }
      await approvalService.ensureApproverConfigured(String((row as any).organizationId), MODULE_KEY_PAYROLL);
      await service.submitForApproval(id);
      await approvalService.enqueuePayrollManagementSubmitted(id, ctx.user!.id);
      return service.getById(id);
    },
  },
  PayrollManagement: {
    id: (p: { _id?: unknown; id?: string }) => (p?._id ?? p?.id) as string,
    docDate: (p: { docDate?: unknown }) => iso(p?.docDate) ?? '',
    createdAt: (p: { createdAt?: unknown }) => iso(p?.createdAt) ?? '',
    payPeriodStart: (p: { payPeriodStart?: unknown }) => iso(p?.payPeriodStart),
    payPeriodEnd: (p: { payPeriodEnd?: unknown }) => iso(p?.payPeriodEnd),
  },
}

/** @graphql-tools/load-files picks this name so Query/Mutation merge into the root schema. */
export const resolvers = payrollmanagementResolvers
