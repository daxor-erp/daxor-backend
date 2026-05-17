import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLValidationError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { DocumentService } from './service'

const service = new DocumentService()

function iso(d: unknown): string | null {
	if (d == null) return null
	const t = new Date(d as string | number | Date).getTime()
	if (Number.isNaN(t)) return null
	return new Date(t).toISOString()
}

export const resolvers = {
	Query: {
		documents: async (
			_: unknown,
			{ parentModule, parentId }: { parentModule: string; parentId: string },
			ctx: GraphQLContext,
		) => {
			assertAuthenticated(ctx)
			return service.listForParent(parentModule, parentId)
		},
		organizationDocuments: async (
			_: unknown,
			{ organizationId, parentModule }: { organizationId: string; parentModule?: string },
			ctx: GraphQLContext,
		) => {
			assertAuthenticated(ctx)
			return service.listForOrganization(organizationId, parentModule)
		},
		document: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.findById(id)
		},
	},
	Mutation: {
		deleteDocument: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const deleted = await service.softDelete(id)
			if (!deleted) throw new GraphQLValidationError('Document not found')
			return deleted
		},
	},
	Document: {
		id: (p: any) => String(p?._id ?? p?.id ?? ''),
		organizationId: (p: any) => String(p.organizationId ?? ''),
		uploadedByUserId: (p: any) => (p.uploadedByUserId != null ? String(p.uploadedByUserId) : null),
		parentId: (p: any) => String(p.parentId ?? ''),
		sizeBytes: (p: any) => Number(p.sizeBytes ?? 0),
		downloadUrl: (p: any) => `/api/documents/${String(p?._id ?? p?.id ?? '')}/download`,
		createdAt: (p: any) => iso(p.createdAt) ?? '',
		updatedAt: (p: any) => iso(p.updatedAt) ?? '',
	},
}
