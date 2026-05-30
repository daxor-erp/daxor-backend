import type { GraphQLContext } from '~/types/graphql.context'
import { assertPlatformAdmin } from '../auth/authz'
import { OrganizationRepository } from '../organization/repository'
import { PackageAssignmentService } from './service'

const service = new PackageAssignmentService()
const organizationRepository = new OrganizationRepository()

function iso(d: unknown): string | null {
	if (d == null) return null
	const t = new Date(d as string | number | Date).getTime()
	if (Number.isNaN(t)) return null
	return new Date(t).toISOString()
}

export const resolvers = {
	Query: {
		packageModuleAssignment: async (
			_: unknown,
			{ packageId, organizationId }: { packageId: string; organizationId: string },
			ctx: GraphQLContext,
		) => {
			assertPlatformAdmin(ctx)
			return service.getAssignment(packageId, organizationId)
		},
		packageModuleAssignments: async (
			_: unknown,
			{ packageId }: { packageId: string },
			ctx: GraphQLContext,
		) => {
			assertPlatformAdmin(ctx)
			return service.listAssignmentsForPackage(packageId)
		},
	},
	Mutation: {
		setPackageModuleAssignment: async (
			_: unknown,
			{
				packageId,
				organizationId,
				enabledModules,
			}: {
				packageId: string
				organizationId: string
				enabledModules: Array<{ moduleKey: string; submoduleKey: string }>
			},
			ctx: GraphQLContext,
		) => {
			assertPlatformAdmin(ctx)
			return service.setAssignment(packageId, organizationId, enabledModules, ctx.user?.id)
		},
		deletePackageModuleAssignment: async (
			_: unknown,
			{ packageId, organizationId }: { packageId: string; organizationId: string },
			ctx: GraphQLContext,
		) => {
			assertPlatformAdmin(ctx)
			return service.deleteAssignment(packageId, organizationId)
		},
	},
	User: {
		packageEnabledModules: async (parent: { organizationId?: unknown }) => {
			const organizationId =
				parent.organizationId != null ? String(parent.organizationId) : null
			if (!organizationId) return []
			const modules = await service.getEnabledModulesForOrganization(organizationId)
			return modules ?? []
		},
	},
	PackageModuleAssignment: {
		id: (p: { _id?: unknown; id?: string }) => String(p?._id ?? p?.id ?? ''),
		packageId: (p: { packageId?: unknown }) => String(p.packageId ?? ''),
		organizationId: (p: { organizationId?: unknown }) => String(p.organizationId ?? ''),
		enabledModules: (p: { enabledModules?: Array<{ moduleKey?: string; submoduleKey?: string }> }) =>
			(Array.isArray(p.enabledModules) ? p.enabledModules : [])
				.filter((m) => m?.moduleKey && m?.submoduleKey)
				.map((m) => ({
					moduleKey: String(m.moduleKey),
					submoduleKey: String(m.submoduleKey),
				})),
		updatedAt: (p: { updatedAt?: unknown }) => iso(p?.updatedAt) ?? '',
		createdAt: (p: { createdAt?: unknown }) => iso(p?.createdAt) ?? '',
		organizationName: async (p: { organizationId?: unknown }) => {
			const id = p.organizationId != null ? String(p.organizationId) : ''
			if (!id) return ''
			const org = await organizationRepository.findById(id)
			return org?.name ? String(org.name) : ''
		},
	},
}
