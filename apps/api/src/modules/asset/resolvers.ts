import { AssetService } from './service'
import { AssetRepository } from './repository'

const assetRepo = new AssetRepository()
const assetService = new AssetService(assetRepo)

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

function coerceFloat(v: unknown): number {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? ''))
  return Number.isFinite(n) ? n : 0
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

function optionalString(value: unknown): string | null {
  if (value == null) return null
  const s = String(value).trim()
  return s === '' ? null : s
}

/** Safe GraphQL payload from a Mongoose asset document. */
function assetToGraphQL(doc: unknown) {
  if (doc == null) {
    throw new Error('Asset resolver received no document')
  }
  const o = asPlain(doc)
  const purchaseDateIso =
    graphqlIsoDate(o.purchaseDate) ?? new Date(0).toISOString()
  return {
    id: String(o._id ?? o.id ?? ''),
    assetNumber: String(o.assetNumber ?? ''),
    assetName: String(o.assetName ?? ''),
    assetType: String(o.assetType ?? ''),
    category: String(o.category ?? ''),
    purchaseDate: purchaseDateIso,
    purchasePrice: coerceFloat(o.purchasePrice),
    currentValue: coerceFloat(o.currentValue),
    depreciationMethod: String(o.depreciationMethod ?? ''),
    usefulLife: Math.max(0, Math.round(coerceFloat(o.usefulLife))),
    location: String(o.location ?? ''),
    assignedTo: optionalString(o.assignedTo),
    status: String(o.status ?? 'ACTIVE'),
    serialNumber: optionalString(o.serialNumber),
    manufacturer: optionalString(o.manufacturer),
    warrantyExpiry: graphqlIsoDate(o.warrantyExpiry),
    organizationId: String(o.organizationId ?? ''),
    createdAt: graphqlIsoDate(o.createdAt) ?? new Date(0).toISOString(),
    updatedAt: graphqlIsoDate(o.updatedAt) ?? new Date(0).toISOString(),
  }
}

export const resolvers = {
  Query: {
    asset: async (_: unknown, { id }: { id: string }) => {
      const doc = await assetService.findByIdOrNull(id)
      if (!doc) return null
      const plain = asPlain(doc)
      if (plain.isDeleted === true) return null
      return assetToGraphQL(doc)
    },
    assets: async (
      _: unknown,
      {
        organizationId,
        page = 1,
        limit = 50,
        status,
        assetType,
      }: {
        organizationId: string
        page?: number
        limit?: number
        status?: string
        assetType?: string
      },
    ) => {
      const rows = await assetService.findByOrg(
        organizationId,
        page,
        limit,
        status,
        assetType,
      )
      return rows.map((d) => assetToGraphQL(d))
    },
  },
  Mutation: {
    createAsset: async (_: unknown, { input }: { input: Record<string, unknown> }) => {
      const doc = await assetService.create(input)
      return assetToGraphQL(doc)
    },
    updateAsset: async (
      _: unknown,
      { id, input }: { id: string; input: Record<string, unknown> },
    ) => {
      const doc = await assetService.update(id, input)
      return assetToGraphQL(doc)
    },
    deleteAsset: async (_: unknown, { id }: { id: string }) => {
      await assetService.remove(id)
      return true
    },
  },
}
