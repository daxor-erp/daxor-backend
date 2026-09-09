import { GoodsReceiptService } from './service';
import type { GraphQLContext } from '~/types/graphql.context';

const service = new GoodsReceiptService();

function graphqlIsoDate(value: unknown): string {
  if (value == null) return new Date(0).toISOString();
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }
  if (typeof value === 'string' && value.length > 0) {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? new Date(0).toISOString() : d.toISOString();
  }
  return new Date(0).toISOString();
}

function asPlain(doc: unknown): Record<string, unknown> {
  if (doc == null) return {};
  const d = doc as {
    toJSON?: () => Record<string, unknown>;
    toObject?: () => Record<string, unknown>;
  };
  if (typeof d.toJSON === 'function') return d.toJSON();
  if (typeof d.toObject === 'function') return d.toObject();
  return doc as Record<string, unknown>;
}

function mapLineItem(l: Record<string, unknown>) {
  return {
    itemId: l.itemId != null ? String(l.itemId) : null,
    itemDescription: String(l.itemDescription ?? ''),
    orderedQty: Number(l.orderedQty) || 0,
    receivedQty: Number(l.receivedQty) || 0,
    unit: l.unit != null ? String(l.unit) : null,
    unitPrice: l.unitPrice != null ? Number(l.unitPrice) : null,
  };
}

function goodsReceiptToGraphQL(doc: unknown) {
  const o = asPlain(doc);
  const id = o._id != null ? String(o._id) : o.id != null ? String(o.id) : '';
  const rawLines = Array.isArray(o.lineItems) ? o.lineItems : [];
  return {
    id,
    docNumber: String(o.docNumber ?? ''),
    docDate: graphqlIsoDate(o.docDate),
    status: String(o.status ?? 'DRAFT'),
    organizationId: String(o.organizationId ?? ''),
    purchaseOrderId: o.purchaseOrderId != null ? String(o.purchaseOrderId) : null,
    purchaseOrderNumber: o.purchaseOrderNumber != null ? String(o.purchaseOrderNumber) : null,
    vendorId: o.vendorId != null ? String(o.vendorId) : null,
    vendorName: o.vendorName != null ? String(o.vendorName) : null,
    warehouseId: o.warehouseId != null ? String(o.warehouseId) : null,
    warehouseName: o.warehouseName != null ? String(o.warehouseName) : null,
    lineItems: rawLines.map((l) => mapLineItem(asPlain(l))),
    notes: o.notes != null ? String(o.notes) : null,
    createdAt: graphqlIsoDate(o.createdAt),
  };
}

export const resolvers = {
  Query: {
    goodsreceipt: async (_: unknown, { id }: { id: string }) => {
      const row = await service.getById(id);
      if (!row) return null;
      const o = asPlain(row);
      if (o.isDeleted === true) return null;
      return goodsReceiptToGraphQL(row);
    },
    goodsreceipts: async (_: unknown, { organizationId }: { organizationId: string }) => {
      const rows = await service.getAll(organizationId);
      return rows.map((r) => goodsReceiptToGraphQL(r));
    },
  },
  Mutation: {
    createGoodsReceipt: async (
      _: unknown,
      { input }: { input: Record<string, unknown> },
      context: GraphQLContext,
    ) => {
      const created = await service.create(input as Parameters<GoodsReceiptService['create']>[0], context.user?.id || 'system');
      return goodsReceiptToGraphQL(created);
    },
    updateGoodsReceipt: async (
      _: unknown,
      { id, input }: { id: string; input: Record<string, unknown> },
    ) => {
      const updated = await service.update(id, input as Parameters<GoodsReceiptService['update']>[1]);
      return goodsReceiptToGraphQL(updated);
    },
    postGoodsReceipt: async (
      _: unknown,
      { id }: { id: string },
      context: GraphQLContext,
    ) => {
      const posted = await service.post(id, context.user?.id || 'system');
      return goodsReceiptToGraphQL(posted);
    },
    deleteGoodsReceipt: async (_: unknown, { id }: { id: string }) => {
      await service.delete(id);
      return true;
    },
  },
};
