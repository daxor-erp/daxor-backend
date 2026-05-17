import { CustomerService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new CustomerService()

const toPlain = (doc: any) => {
  if (!doc) return null
  const obj = doc.toObject ? doc.toObject() : doc
  return {
    ...obj,
    id: obj._id?.toString() || obj.id,
    organizationId: obj.organizationId?.toString(),
    invoiceBillable: obj.invoiceBillable !== false,
    createdAt: obj.createdAt instanceof Date ? obj.createdAt.toISOString() : obj.createdAt,
    updatedAt: obj.updatedAt instanceof Date ? obj.updatedAt.toISOString() : obj.updatedAt,
  }
}

export const resolvers = {
  Query: {
    customer: async (_: unknown, { id }: { id: string }) => {
      const doc = await service.getCustomerById(id)
      return toPlain(doc)
    },

    customers: async (_: unknown, args: any) => {
      const { organizationId, page = 1, limit = 100, search } = args
      const filter: any = { organizationId }
      if (search) filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
      ]
      const docs = await service.getAllCustomers(filter, page, limit)
      return docs.map(toPlain)
    },

    invoiceBillableCustomers: async (_: unknown, args: any) => {
      const { organizationId, page = 1, limit = 200 } = args
      const filter: any = {
        organizationId,
        deletedAt: null,
        $or: [{ invoiceBillable: true }, { invoiceBillable: { $exists: false } }],
      }
      const docs = await service.getAllCustomers(filter, page, limit)
      return docs.map(toPlain)
    },
  },

  Mutation: {
    createCustomer: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
  const doc = await service.createCustomer(input, ctx.user?.id ?? '')

  if (!doc) {
    throw new Error('Customer creation failed')
  }

  return toPlain(doc)
},

    updateCustomer: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => {
      const doc = await service.updateCustomer(id, input, ctx.user?.id ?? '')
      return toPlain(doc)
    },

    deleteCustomer: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      await service.deleteCustomer(id, ctx.user?.id ?? '')
      return true
    },
  },

  Customer: {
    id: (parent: any) => parent._id?.toString() || parent.id,
    organizationId: (parent: any) => String(parent.organizationId ?? ''),
    invoiceBillable: (parent: any) => parent.invoiceBillable !== false,
    createdAt: (parent: any) => {
      const d = parent.createdAt
      if (d instanceof Date) return d.toISOString()
      if (typeof d === 'string' && d.length > 0) return d
      return new Date(0).toISOString()
    },
    updatedAt: (parent: any) => {
      const d = parent.updatedAt ?? parent.createdAt
      if (d instanceof Date) return d.toISOString()
      if (typeof d === 'string' && d.length > 0) return d
      return new Date(0).toISOString()
    },
  },
}
