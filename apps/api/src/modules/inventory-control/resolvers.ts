import { InventoryControlService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new InventoryControlService()

function asPlain(doc: unknown): Record<string, unknown> {
	if (doc == null) return {}
	const d = doc as {
		toJSON?: () => Record<string, unknown>
		toObject?: () => Record<string, unknown>
	}
	if (typeof d.toJSON === 'function') return d.toJSON()
	if (typeof d.toObject === 'function') return d.toObject()
	return doc as Record<string, unknown>
}

function graphqlIsoDate(value: unknown): string | null {
	if (value == null) return null
	if (value instanceof Date && !Number.isNaN(value.getTime())) {
		return value.toISOString()
	}
	if (typeof value === 'string' && value.length > 0) {
		const d = new Date(value)
		return Number.isNaN(d.getTime()) ? null : d.toISOString()
	}
	return null
}

function coerceFloat(value: unknown): number {
	const n = typeof value === 'number' ? value : parseFloat(String(value ?? ''))
	return Number.isFinite(n) ? n : 0
}

function icToGraphQL(doc: unknown) {
	if (doc == null) {
		throw new Error('Inventory control operation returned no document')
	}
	const o = asPlain(doc)
	return {
		id: String(o._id ?? o.id ?? ''),
		itemId: String(o.itemId ?? ''),
		itemName: String(o.itemName ?? ''),
		binLocation: String(o.binLocation ?? ''),
		quantity: coerceFloat(o.quantity),
		unit: String(o.unit ?? ''),
		minStockLevel: coerceFloat(o.minStockLevel),
		maxStockLevel: coerceFloat(o.maxStockLevel),
		reorderPoint: coerceFloat(o.reorderPoint),
		warehouseId: String(o.warehouseId ?? ''),
		lastStockDate: graphqlIsoDate(o.lastStockDate) ?? new Date(0).toISOString(),
		stockStatus: String(o.stockStatus ?? 'IN_STOCK'),
		organizationId: String(o.organizationId ?? ''),
		createdAt: graphqlIsoDate(o.createdAt) ?? new Date(0).toISOString(),
	}
}

function stockMovementToGraphQL(doc: unknown) {
	if (doc == null) {
		throw new Error('Stock movement operation returned no document')
	}
	const o = asPlain(doc)
	return {
		id: String(o._id ?? o.id ?? ''),
		itemId: String(o.itemId ?? ''),
		movementType: String(o.movementType ?? ''),
		fromLocation: String(o.fromLocation ?? ''),
		toLocation: String(o.toLocation ?? ''),
		quantity: coerceFloat(o.quantity),
		unit: String(o.unit ?? ''),
		referenceModule: String(o.referenceModule ?? ''),
		referenceId: String(o.referenceId ?? ''),
		movementDate: graphqlIsoDate(o.movementDate) ?? new Date(0).toISOString(),
		notes: o.notes != null && String(o.notes).trim() !== '' ? String(o.notes) : null,
		organizationId: String(o.organizationId ?? ''),
		createdAt: graphqlIsoDate(o.createdAt) ?? new Date(0).toISOString(),
	}
}

export const resolvers = {
	Query: {
		inventoryControl: async (_: unknown, { id }: { id: string }) => {
			const row = await service.getInventoryControlById(id)
			return row ? icToGraphQL(row) : null
		},
		inventoryControls: async (
			_: unknown,
			{ organizationId, warehouseId, stockStatus }: Record<string, unknown>,
		) => {
			const rows = await service.getInventoryControls(String(organizationId ?? ''), {
				warehouseId: warehouseId != null ? String(warehouseId) : undefined,
				stockStatus: stockStatus != null ? String(stockStatus) : undefined,
			})
			return rows.map((r) => icToGraphQL(r))
		},
		stockMovement: async (_: unknown, { id }: { id: string }) => {
			const row = await service.getStockMovementById(id)
			return row ? stockMovementToGraphQL(row) : null
		},
		stockMovements: async (
			_: unknown,
			{ organizationId, itemId }: { organizationId: string; itemId?: string },
		) => {
			const rows = await service.getStockMovements(organizationId, itemId)
			return rows.map((r) => stockMovementToGraphQL(r))
		},
		lowStockItems: async (_: unknown, { organizationId }: { organizationId: string }) => {
			const rows = await service.getLowStockItems(organizationId)
			return rows.map((r) => icToGraphQL(r))
		},
	},
	Mutation: {
		createInventoryControl: async (_: unknown, { input }: { input: Record<string, unknown> }) => {
			const row = await service.createInventoryControl(input as any)
			if (row == null) throw new Error('Failed to create inventory control')
			return icToGraphQL(row)
		},
		updateInventoryControl: async (
			_: unknown,
			{ id, input }: { id: string; input: Record<string, unknown> },
		) => {
			const row = await service.updateInventoryControl(id, input as any)
			if (row == null) throw new Error('Failed to update inventory control')
			return icToGraphQL(row)
		},
		createStockMovement: async (
			_: unknown,
			{ input }: { input: Record<string, unknown> },
			context: GraphQLContext,
		) => {
			const row = await service.createStockMovement(input as any, context.user?.id || 'system')
			if (row == null) throw new Error('Failed to create stock movement')
			return stockMovementToGraphQL(row)
		},
		adjustStock: async (
			_: unknown,
			{
				itemId,
				binLocation,
				quantity,
				reason,
				organizationId,
			}: {
				itemId: string
				binLocation: string
				quantity: number
				reason: string
				organizationId?: string | null
			},
			context: GraphQLContext,
		) => {
			const row = await service.adjustStock(
				itemId,
				binLocation,
				quantity,
				reason,
				context.user?.id || 'system',
				organizationId != null ? String(organizationId) : undefined,
			)
			if (row == null) throw new Error('Failed to read inventory after adjustment')
			return icToGraphQL(row)
		},
	},
}
