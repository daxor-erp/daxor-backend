import { loadBillToParty } from '~/lib/bill-to-party'
import { CustomerStatementService } from './service'

const service = new CustomerStatementService()

export const resolvers = {
	Query: {
		generateCustomerStatement: async (
			_: unknown,
			args: { organizationId: string; customerId: string; dateFrom: string; dateTo: string },
		) => service.generate(args.organizationId, args.customerId, args.dateFrom, args.dateTo),
	},

	CustomerStatement: {
		customer: async (parent: any) => {
			const id = parent.customerId?.toString?.() ?? String(parent.customerId)
			if (!id) return null
			return loadBillToParty(id)
		},
	},
}
