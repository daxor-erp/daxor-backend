import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLValidationError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { AssetMaintenanceService } from './service'

const service = new AssetMaintenanceService()

function iso(d: unknown): string | null {
	if (d == null) return null
	const t = new Date(d as string | number | Date).getTime()
	if (Number.isNaN(t)) return null
	return new Date(t).toISOString()
}

export const resolvers = {
	Query: {
		assetMaintenance: async (_: unknown, { id }: { id: string }) => service.findById(id),
		assetMaintenances: async (_: unknown, { organizationId, status, assetId, maintenanceType, search }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.list(organizationId, { status, assetId, maintenanceType, search })
		},
		upcomingMaintenance: async (_: unknown, { organizationId, days }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.upcoming(organizationId, typeof days === 'number' ? days : 30)
		},
	},
	Mutation: {
		createAssetMaintenance: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.create(input)
		},
		updateAssetMaintenance: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const updated = await service.update(id, input)
			if (!updated) throw new GraphQLValidationError('Maintenance not found')
			return updated
		},
		deleteAssetMaintenance: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const deleted = await service.softDelete(id)
			if (!deleted) throw new GraphQLValidationError('Maintenance not found')
			return deleted
		},
		startAssetMaintenance: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.start(id)
		},
		completeAssetMaintenance: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.complete(id, input ?? {})
		},
	},
	AssetMaintenance: {
		id: (p: any) => String(p?._id ?? p?.id ?? ''),
		organizationId: (p: any) => String(p.organizationId ?? ''),
		assetId: (p: any) => String(p.assetId ?? ''),
		assignedToUserId: (p: any) => (p.assignedToUserId != null ? String(p.assignedToUserId) : null),
		vendorId: (p: any) => (p.vendorId != null ? String(p.vendorId) : null),
		scheduledDate: (p: any) => iso(p.scheduledDate) ?? '',
		startedAt: (p: any) => iso(p.startedAt),
		completedAt: (p: any) => iso(p.completedAt),
		nextScheduledDate: (p: any) => iso(p.nextScheduledDate),
		maintenanceType: (p: any) => p.maintenanceType ?? 'PREVENTIVE',
		priority: (p: any) => p.priority ?? 'MEDIUM',
		status: (p: any) => p.status ?? 'SCHEDULED',
		partsUsed: (p: any) => (p.partsUsed ?? []).map((u: any) => ({
			itemId: u.itemId != null ? String(u.itemId) : null,
			itemName: u.itemName ?? '',
			quantity: Number(u.quantity ?? 0),
			unit: u.unit ?? 'unit',
			costPerUnit: Number(u.costPerUnit ?? 0),
			lineTotal: Number(u.lineTotal ?? 0),
		})),
		laborHours: (p: any) => Number(p.laborHours ?? 0),
		laborRate: (p: any) => Number(p.laborRate ?? 0),
		partsCost: (p: any) => Number(p.partsCost ?? 0),
		laborCost: (p: any) => Number(p.laborCost ?? 0),
		totalCost: (p: any) => Number(p.totalCost ?? 0),
		downtimeHours: (p: any) => Number(p.downtimeHours ?? 0),
		createdAt: (p: any) => iso(p.createdAt) ?? '',
		updatedAt: (p: any) => iso(p.updatedAt) ?? '',
	},
}
