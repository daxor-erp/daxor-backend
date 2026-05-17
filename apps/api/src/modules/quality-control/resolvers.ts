import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLValidationError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { QualityControlService } from './service'

const service = new QualityControlService()

function iso(d: unknown): string | null {
	if (d == null) return null
	const t = new Date(d as string | number | Date).getTime()
	if (Number.isNaN(t)) return null
	return new Date(t).toISOString()
}

export const resolvers = {
	Query: {
		qcInspection: async (_: unknown, { id }: { id: string }) => service.findById(id),
		qcInspections: async (_: unknown, { organizationId, outcome, sourceModule, sourceId, search }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.list(organizationId, { outcome, sourceModule, sourceId, search })
		},
		qcOutcomeSummary: async (_: unknown, { organizationId }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const rows = await service.outcomeSummary(organizationId)
			return rows.map((r: any) => ({
				outcome: r._id ?? 'PENDING',
				count: r.count ?? 0,
				quantityInspected: Number(r.quantityInspected ?? 0),
				quantityPassed: Number(r.quantityPassed ?? 0),
				quantityFailed: Number(r.quantityFailed ?? 0),
			}))
		},
	},
	Mutation: {
		createQCInspection: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.create(input)
		},
		updateQCInspection: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const updated = await service.update(id, input)
			if (!updated) throw new GraphQLValidationError('Inspection not found')
			return updated
		},
		deleteQCInspection: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const deleted = await service.softDelete(id)
			if (!deleted) throw new GraphQLValidationError('Inspection not found')
			return deleted
		},
		setQCInspectionOutcome: async (_: unknown, { id, outcome, notes }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.setOutcome(id, outcome, notes)
		},
	},
	QCInspection: {
		id: (p: any) => String(p?._id ?? p?.id ?? ''),
		organizationId: (p: any) => String(p.organizationId ?? ''),
		inspectorUserId: (p: any) => (p.inspectorUserId != null ? String(p.inspectorUserId) : null),
		sourceId: (p: any) => (p.sourceId != null ? String(p.sourceId) : null),
		itemId: (p: any) => (p.itemId != null ? String(p.itemId) : null),
		inspectionDate: (p: any) => iso(p.inspectionDate) ?? '',
		quantityInspected: (p: any) => Number(p.quantityInspected ?? 0),
		quantityPassed: (p: any) => Number(p.quantityPassed ?? 0),
		quantityFailed: (p: any) => Number(p.quantityFailed ?? 0),
		quantityReworked: (p: any) => Number(p.quantityReworked ?? 0),
		outcome: (p: any) => p.outcome ?? 'PENDING',
		defects: (p: any) => (p.defects ?? []).map((d: any) => ({
			code: d.code ?? '',
			description: d.description ?? null,
			severity: d.severity ?? 'MINOR',
			quantity: Number(d.quantity ?? 0),
			rootCause: d.rootCause ?? null,
			correctiveAction: d.correctiveAction ?? null,
		})),
		createdAt: (p: any) => iso(p.createdAt) ?? '',
		updatedAt: (p: any) => iso(p.updatedAt) ?? '',
	},
}
