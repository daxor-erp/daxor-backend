import { WarehouseService } from './service'
import type { IWarehouse, IWarehouseBin } from './model'

const service = new WarehouseService()

function graphqlIsoDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString()
  }
  if (typeof value === 'string' && value.length > 0) {
    return value
  }
  return new Date(0).toISOString()
}

function coerceFloat(value: unknown): number {
  const n = typeof value === 'number' ? value : parseFloat(String(value ?? ''))
  return Number.isFinite(n) ? n : 0
}

/** Plain objects for GraphQL — avoids Mongoose Date/ObjectId/default resolver issues. */
function warehouseToGraphQL(doc: Record<string, unknown> | null | undefined) {
  if (doc == null) {
    throw new Error('Warehouse operation returned no document')
  }
  const id =
    doc._id != null ? String(doc._id) : doc.id != null ? String(doc.id) : ''
  return {
    id,
    warehouseCode: String(doc.warehouseCode ?? ''),
    warehouseName: String(doc.warehouseName ?? ''),
    location: String(doc.location ?? ''),
    address: String(doc.address ?? ''),
    capacity: coerceFloat(doc.capacity),
    currentUtilization: coerceFloat(doc.currentUtilization),
    managerName: String(doc.managerName ?? ''),
    contactNumber: String(doc.contactNumber ?? ''),
    warehouseType: String(doc.warehouseType ?? ''),
    isActive: doc.isActive !== false && doc.isActive !== 'false',
    organizationId: String(doc.organizationId ?? ''),
    createdAt: graphqlIsoDate(doc.createdAt),
  }
}

function warehouseBinToGraphQL(doc: Record<string, unknown> | null | undefined) {
  if (doc == null) {
    throw new Error('Warehouse bin operation returned no document')
  }
  const id =
    doc._id != null ? String(doc._id) : doc.id != null ? String(doc.id) : ''
  return {
    id,
    warehouseId: String(doc.warehouseId ?? ''),
    binCode: String(doc.binCode ?? ''),
    binLocation: String(doc.binLocation ?? ''),
    binType: String(doc.binType ?? ''),
    capacity: coerceFloat(doc.capacity),
    currentStock: coerceFloat(doc.currentStock),
    isAvailable: doc.isAvailable !== false && doc.isAvailable !== 'false',
    organizationId: String(doc.organizationId ?? ''),
    createdAt: graphqlIsoDate(doc.createdAt),
  }
}

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

/** Must be named `resolvers` so @graphql-tools/load-files merges Query/Mutation onto the schema root. */
export const resolvers = {
  Query: {
    warehouse: async (_: unknown, { id }: { id: string }) => {
      const doc = await service.getWarehouseById(id)
      return doc ? warehouseToGraphQL(asPlain(doc)) : null
    },
    warehouses: async (
      _: unknown,
      { organizationId, isActive }: { organizationId: string; isActive?: boolean },
    ) => {
      const rows = await service.getWarehouses(organizationId, isActive)
      return rows.map((doc) => warehouseToGraphQL(asPlain(doc)))
    },
    warehouseBin: async (_: unknown, { id }: { id: string }) => {
      const doc = await service.getWarehouseBinById(id)
      return doc ? warehouseBinToGraphQL(asPlain(doc)) : null
    },
    warehouseBins: async (
      _: unknown,
      {
        organizationId,
        warehouseId,
      }: { organizationId: string; warehouseId?: string },
    ) => {
      const rows = await service.getWarehouseBins(organizationId, warehouseId)
      return rows.map((doc) => warehouseBinToGraphQL(asPlain(doc)))
    },
  },
  Mutation: {
    createWarehouse: async (_: unknown, { input }: { input: Record<string, unknown> }) => {
      const doc = await service.createWarehouse(input as Partial<IWarehouse>)
      return warehouseToGraphQL(asPlain(doc))
    },
    updateWarehouse: async (
      _: unknown,
      { id, input }: { id: string; input: Record<string, unknown> },
    ) => {
      const doc = await service.updateWarehouse(id, input as Partial<IWarehouse>)
      if (!doc) throw new Error('Warehouse not found')
      return warehouseToGraphQL(asPlain(doc))
    },
    createWarehouseBin: async (_: unknown, { input }: { input: Record<string, unknown> }) => {
      const doc = await service.createWarehouseBin(input as Partial<IWarehouseBin>)
      return warehouseBinToGraphQL(asPlain(doc))
    },
    updateWarehouseBin: async (
      _: unknown,
      { id, input }: { id: string; input: Record<string, unknown> },
    ) => {
      const doc = await service.updateWarehouseBin(id, input as Partial<IWarehouseBin>)
      if (!doc) throw new Error('Warehouse bin not found')
      return warehouseBinToGraphQL(asPlain(doc))
    },
  },
}
