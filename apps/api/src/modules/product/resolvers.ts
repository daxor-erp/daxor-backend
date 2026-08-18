import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLValidationError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { ProductService } from './service'
import { ProductVariantService } from '../product-variant/service'
import { AttributeService } from '../attribute/service'
import { UomService } from '../uom/service'
import { ProductCategoryService } from '../product-category/service'
import { TaxRateService } from '../tax-rate/service'
import { VendorService } from '../vendor/service'
import { WarehouseService } from '../warehouse/service'
import { ProductStockService } from '../product-stock/service'
import { PurchaseOrderService } from '../purchase-order/service'

const productService = new ProductService()
const variantService = new ProductVariantService()
const attributeService = new AttributeService()
const uomService = new UomService()
const categoryService = new ProductCategoryService()
const taxRateService = new TaxRateService()
const vendorService = new VendorService()
const warehouseService = new WarehouseService()
const productStockService = new ProductStockService()
const purchaseOrderService = new PurchaseOrderService()

export const resolvers = {
	Query: {
		product: async (_: unknown, { id }: { id: string }) => productService.getProductById(id),
		products: async (_: unknown, args: any) => {
			const { organizationId, search, categoryId, canBePurchased, canBeSold, status } = args
			return productService.getProductsByOrganization(organizationId, {
				search,
				categoryId,
				canBePurchased,
				canBeSold,
				status,
			})
		},
	},

	Mutation: {
		createProduct: async (_: unknown, { input }: { input: any }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return productService.createProduct(input, ctx.user?.id ?? '')
		},

		updateProduct: async (_: unknown, { id, input }: { id: string; input: any }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const updated = await productService.updateProduct(id, input, ctx.user?.id ?? '')
			if (!updated) throw new GraphQLValidationError('Product not found')
			return updated
		},

		deleteProduct: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			await productService.deleteProduct(id, ctx.user?.id ?? '')
			return true
		},

		updateProductQuantity: async (
			_: unknown,
			{ productId, quantity, warehouseId, notes }: { productId: string; quantity: number; warehouseId?: string; notes?: string },
			ctx: GraphQLContext,
		) => {
			assertAuthenticated(ctx)
			const product = await productService.getProductById(productId)
			if (!product) throw new GraphQLValidationError('Product not found')
			await productStockService.updateQuantity(productId, quantity, ctx.user?.id ?? '', {
				warehouseId: warehouseId ?? null,
				notes,
				organizationId: String((product as any).organizationId),
			})
			return product
		},

		replenishProduct: async (
			_: unknown,
			{ productId, quantity }: { productId: string; quantity?: number },
			ctx: GraphQLContext,
		) => {
			assertAuthenticated(ctx)
			const product = await productService.getProductById(productId)
			if (!product) throw new GraphQLValidationError('Product not found')
			const suggestion = await productStockService.replenish(productId, quantity ?? 0, ctx.user?.id ?? '')
			const created = await purchaseOrderService.create(
				{
					organizationId: (product as any).organizationId,
					vendorId: suggestion.vendorId,
					orderDate: new Date().toISOString(),
					items: [
						{
							productId,
							productName: (product as any).name,
							quantity: suggestion.qty,
							unitPrice: suggestion.unitPrice,
							uomId: (product as any).purchaseUomId ?? (product as any).uomId ?? undefined,
						},
					],
				},
				ctx.user?.id ?? '',
			)
			return {
				purchaseOrder: created,
				vendorId: suggestion.vendorId,
				quantity: suggestion.qty,
				unitPrice: suggestion.unitPrice,
			}
		},

		holdProductForQc: async (
			_: unknown,
			{ productId, quantity, warehouseId, referenceId }: { productId: string; quantity: number; warehouseId?: string; referenceId?: string },
			ctx: GraphQLContext,
		) => {
			assertAuthenticated(ctx)
			const product = await productService.getProductById(productId)
			if (!product) throw new GraphQLValidationError('Product not found')
			await productStockService.holdForQc(productId, quantity, {
				warehouseId: warehouseId ?? null,
				organizationId: String((product as any).organizationId),
				referenceId,
			})
			return product
		},

		releaseProductFromQc: async (
			_: unknown,
			{ productId, quantity, decision, warehouseId, notes }: { productId: string; quantity: number; decision: string; warehouseId?: string; notes?: string },
			ctx: GraphQLContext,
		) => {
			assertAuthenticated(ctx)
			const product = await productService.getProductById(productId)
			if (!product) throw new GraphQLValidationError('Product not found')
			if (decision !== 'pass' && decision !== 'fail') throw new GraphQLValidationError('decision must be "pass" or "fail"')
			await productStockService.releaseFromQc(productId, quantity, decision as 'pass' | 'fail', {
				warehouseId: warehouseId ?? null,
				organizationId: String((product as any).organizationId),
				notes,
			})
			return product
		},
	},

	Product: {
		id: (p: any) => String(p._id ?? p.id ?? ''),
		organizationId: (p: any) => String(p.organizationId ?? ''),
		images: (p: any) => p.images ?? [],
		canBeSold: (p: any) => !!p.canBeSold,
		canBePurchased: (p: any) => p.canBePurchased !== false,
		canBeExpensed: (p: any) => !!p.canBeExpensed,
		productType: (p: any) => p.productType ?? 'goods',
		trackInventory: (p: any) => p.trackInventory !== false,
		trackingMethod: (p: any) => p.trackingMethod ?? 'none',
		salesPrice: (p: any) => p.salesPrice ?? 0,
		costPrice: (p: any) => p.costPrice ?? 0,
		salesTaxIds: (p: any) => (p.salesTaxIds ?? []).map(String),
		purchaseTaxIds: (p: any) => (p.purchaseTaxIds ?? []).map(String),
		categoryId: (p: any) => (p.categoryId != null ? String(p.categoryId) : null),
		category: async (p: any) => (p.categoryId ? categoryService.findById(String(p.categoryId)) : null),
		uomId: (p: any) => (p.uomId != null ? String(p.uomId) : null),
		uom: async (p: any) => (p.uomId ? uomService.findById(String(p.uomId)) : null),
		purchaseUomId: (p: any) => (p.purchaseUomId != null ? String(p.purchaseUomId) : null),
		purchaseUom: async (p: any) => (p.purchaseUomId ? uomService.findById(String(p.purchaseUomId)) : null),
		salesTaxes: async (p: any) =>
			Promise.all((p.salesTaxIds ?? []).map((id: unknown) => taxRateService.findById(String(id)))).then((rows) =>
				rows.filter(Boolean),
			),
		purchaseTaxes: async (p: any) =>
			Promise.all((p.purchaseTaxIds ?? []).map((id: unknown) => taxRateService.findById(String(id)))).then(
				(rows) => rows.filter(Boolean),
			),
		attributeLines: (p: any) =>
			(p.attributeLines ?? []).map((l: any) => ({
				attributeId: String(l.attributeId),
				valueIds: (l.valueIds ?? []).map(String),
			})),
		variants: async (p: any) => variantService.findByProduct(String(p._id ?? p.id)),
		vendorPricelist: (p: any) =>
			(p.vendorPricelist ?? []).map((l: any) => ({
				id: String(l._id ?? ''),
				vendorId: String(l.vendorId),
				leadTimeDays: l.leadTimeDays ?? 0,
				minQty: l.minQty ?? 1,
				price: l.price ?? 0,
			})),
		status: (p: any) => p.status ?? 'active',
		createdAt: (p: any) => (p.createdAt ? new Date(p.createdAt).toISOString() : ''),
		updatedAt: (p: any) => (p.updatedAt ? new Date(p.updatedAt).toISOString() : ''),
		onHandQty: async (p: any) => productStockService.getOnHandQty(String(p._id ?? p.id)),
		forecastedQty: async (p: any) => productStockService.getForecastedQty(String(p._id ?? p.id)),
		purchasedQty: async (p: any) => productStockService.getPurchasedQty(String(p._id ?? p.id)),
		qcHoldQty: async (p: any) => productStockService.getQcHoldQty(String(p._id ?? p.id)),
		reorderingRules: (p: any) =>
			(p.reorderingRules ?? []).map((r: any) => ({
				id: String(r._id ?? ''),
				warehouseId: r.warehouseId != null ? String(r.warehouseId) : null,
				minQty: r.minQty ?? 0,
				maxQty: r.maxQty ?? 0,
			})),
		packagings: (p: any) =>
			(p.packagings ?? []).map((pkg: any) => ({
				id: String(pkg._id ?? ''),
				name: pkg.name,
				qtyPerPackage: pkg.qtyPerPackage ?? 1,
				barcode: pkg.barcode ?? '',
			})),
	},

	ProductReorderingRule: {
		warehouse: async (r: any) => (r.warehouseId ? warehouseService.getWarehouseById(String(r.warehouseId)) : null),
	},

	ProductAttributeLine: {
		attribute: async (l: any) => attributeService.findById(String(l.attributeId)),
	},

	VendorPricelistLine: {
		vendor: async (l: any) => vendorService.getVendorById(String(l.vendorId)),
	},

}
