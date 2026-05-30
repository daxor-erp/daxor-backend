import type { GraphQLContext } from '~/types/graphql.context'
import { assertPlatformAdmin } from '../auth/authz'
import { PackageService } from './service'

const service = new PackageService()

function iso(d: unknown): string | null {
	if (d == null) return null
	const t = new Date(d as string | number | Date).getTime()
	if (Number.isNaN(t)) return null
	return new Date(t).toISOString()
}

export const resolvers = {
	Query: {
		packages: async (_: unknown, __: unknown, ctx: GraphQLContext) => {
			assertPlatformAdmin(ctx)
			return service.list()
		},
	},
	Mutation: {
		createPackage: async (_: unknown, { input }: { input: Record<string, unknown> }, ctx: GraphQLContext) => {
			assertPlatformAdmin(ctx)
			return service.create({
				packageName: String(input.packageName ?? ''),
				externalName: String(input.externalName ?? ''),
				price: Number(input.price),
				durationDays: Number(input.durationDays),
				createdBy: ctx.user?.id,
			})
		},
		updatePackage: async (
			_: unknown,
			{ id, input }: { id: string; input: Record<string, unknown> },
			ctx: GraphQLContext,
		) => {
			assertPlatformAdmin(ctx)
			return service.update(id, {
				packageName: String(input.packageName ?? ''),
				externalName: String(input.externalName ?? ''),
				price: Number(input.price),
				durationDays: Number(input.durationDays),
			})
		},
	},
	Package: {
		id: (p: { _id?: unknown; id?: string }) => String(p?._id ?? p?.id ?? ''),
		packageName: (p: { packageName?: string }) => p.packageName ?? '',
		externalName: (p: { externalName?: string }) => p.externalName ?? '',
		price: (p: { price?: number }) => Number(p.price ?? 0),
		durationDays: (p: { durationDays?: number }) => Number(p.durationDays ?? 0),
		createdAt: (p: { createdAt?: unknown }) => iso(p?.createdAt) ?? '',
		updatedAt: (p: { updatedAt?: unknown }) => iso(p?.updatedAt) ?? '',
	},
}
