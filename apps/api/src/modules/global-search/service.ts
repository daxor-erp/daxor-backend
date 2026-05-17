/**
 * Cross-collection global search. Performs case-insensitive regex match on
 * the most identifying fields of the busy collections; returns up to N hits
 * per collection grouped by kind.
 */

const mongoose = require('mongoose') as typeof import('mongoose')

export type SearchHit = {
	id: string
	kind: string
	title: string
	subtitle?: string
	link: string
	matchedField?: string
}

export class GlobalSearchService {
	async search(organizationId: string, query: string, limitPerKind = 5): Promise<SearchHit[]> {
		if (!query?.trim()) return []
		const rx = new RegExp(escapeRegex(query.trim()), 'i')
		const orgFilter = { organizationId: this.toObjectIdMaybe(organizationId), deletedAt: null }

		const hits: SearchHit[] = []

		const safe = async <T>(p: Promise<T[]>): Promise<T[]> => {
			try {
				return await p
			} catch {
				return []
			}
		}

		// Customers
		const customers = await safe<any>(
			mongoose.connection.collection('customers')
				.find({ $and: [orgFilter, { $or: [{ name: rx }, { contactPerson: rx }, { email: rx }, { phone: rx }] }] })
				.limit(limitPerKind)
				.toArray() as any,
		)
		for (const c of customers) {
			hits.push({
				id: String(c._id),
				kind: 'Customer',
				title: c.name ?? '(unnamed)',
				subtitle: c.email ?? c.phone ?? c.contactPerson ?? null,
				link: `/customers`,
			} as any)
		}

		// Vendors
		const vendors = await safe<any>(
			mongoose.connection.collection('vendors')
				.find({ $and: [orgFilter, { $or: [{ name: rx }, { contactPerson: rx }, { email: rx }, { phone: rx }] }] })
				.limit(limitPerKind)
				.toArray() as any,
		)
		for (const v of vendors) {
			hits.push({
				id: String(v._id),
				kind: 'Vendor',
				title: v.name ?? '(unnamed)',
				subtitle: v.email ?? v.phone ?? null,
				link: `/vendors`,
			} as any)
		}

		// Items
		const items = await safe<any>(
			mongoose.connection.collection('items')
				.find({ $and: [orgFilter, { $or: [{ name: rx }, { description: rx }, { category: rx }] }] })
				.limit(limitPerKind)
				.toArray() as any,
		)
		for (const it of items) {
			hits.push({
				id: String(it._id),
				kind: 'Item',
				title: it.name ?? '(unnamed)',
				subtitle: it.category ?? it.unit ?? null,
				link: `/inventory/items`,
			} as any)
		}

		// Customer invoices
		const invoices = await safe<any>(
			mongoose.connection.collection('customerinvoices')
				.find({ $and: [orgFilter, { $or: [{ seqNo: rx }, { invoiceNumber: rx }] }] })
				.limit(limitPerKind)
				.toArray() as any,
		)
		for (const inv of invoices) {
			hits.push({
				id: String(inv._id),
				kind: 'Invoice',
				title: `#${inv.seqNo ?? inv.invoiceNumber ?? String(inv._id).slice(-6)}`,
				subtitle: inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString() : null,
				link: `/sales/create-invoices`,
			} as any)
		}

		// Purchase orders
		const pos = await safe<any>(
			mongoose.connection.collection('purchaseorders')
				.find({ $and: [orgFilter, { $or: [{ seqNo: rx }, { vendorName: rx }, { projectName: rx }] }] })
				.limit(limitPerKind)
				.toArray() as any,
		)
		for (const po of pos) {
			hits.push({
				id: String(po._id),
				kind: 'PurchaseOrder',
				title: `PO #${po.seqNo ?? String(po._id).slice(-6)}`,
				subtitle: po.vendorName ?? null,
				link: `/purchases/enter-purchase-orders`,
			} as any)
		}

		// Sales orders
		const sos = await safe<any>(
			mongoose.connection.collection('salesorders')
				.find({ $and: [orgFilter, { $or: [{ seqNo: rx }] }] })
				.limit(limitPerKind)
				.toArray() as any,
		)
		for (const so of sos) {
			hits.push({
				id: String(so._id),
				kind: 'SalesOrder',
				title: `SO #${so.seqNo ?? String(so._id).slice(-6)}`,
				subtitle: so.orderDate ? new Date(so.orderDate).toLocaleDateString() : null,
				link: `/sales-orders`,
			} as any)
		}

		// Quotations
		const quotations = await safe<any>(
			mongoose.connection.collection('quotations')
				.find({ $and: [orgFilter, { $or: [{ quotationNumber: rx }, { subject: rx }] }] })
				.limit(limitPerKind)
				.toArray() as any,
		)
		for (const q of quotations) {
			hits.push({
				id: String(q._id),
				kind: 'Quotation',
				title: q.quotationNumber ?? `#${String(q._id).slice(-6)}`,
				subtitle: q.subject ?? null,
				link: `/quotations`,
			} as any)
		}

		// Employees
		const employees = await safe<any>(
			mongoose.connection.collection('employeemasters')
				.find({ $and: [orgFilter, { $or: [{ employeeCode: rx }, { firstName: rx }, { lastName: rx }, { workEmail: rx }] }] })
				.limit(limitPerKind)
				.toArray() as any,
		)
		for (const e of employees) {
			hits.push({
				id: String(e._id),
				kind: 'Employee',
				title: `${e.firstName ?? ''} ${e.lastName ?? ''}`.trim() || e.employeeCode,
				subtitle: e.designation ?? e.workEmail ?? null,
				link: `/hr/masters/employee-master`,
			} as any)
		}

		return hits
	}

	private toObjectIdMaybe(id: string): any {
		try {
			return new mongoose.Types.ObjectId(id)
		} catch {
			return id
		}
	}
}

function escapeRegex(s: string): string {
	return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
