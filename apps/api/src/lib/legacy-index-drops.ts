import type { Connection } from 'mongoose'

/**
 * Drops legacy unique indexes on *Code / `code` fields left from older schemas.
 * Current flows use seqNo / doc numbers only; without dropping these, inserts can hit
 * E11000 duplicate key { …Code: null } when the app no longer sets those fields.
 */
export async function dropLegacyCodeFieldIndexes(connection: Connection): Promise<void> {
	const drops: readonly (readonly [string, readonly string[]])[] = [
		['projects', ['projectCode_1']],
		['vendors', ['vendorCode_1', 'code_1']],
		['customers', ['customerCode_1', 'code_1']],
		['clients', ['clientCode_1', 'code_1']],
		['items', ['itemCode_1', 'code_1']],
		['products', ['productCode_1', 'code_1']],
		['organizations', ['organizationCode_1', 'orgCode_1', 'code_1']],
		['users', ['userCode_1', 'code_1']],
		['quotations', ['quotationCode_1', 'code_1']],
		['salesorders', ['salesOrderCode_1', 'code_1']],
		['salesquotations', ['quotationCode_1', 'code_1']],
		['purchaseorders', ['purchaseOrderCode_1', 'code_1']],
		['vendorbills', ['vendorBillCode_1', 'billCode_1', 'code_1']],
		['customerinvoices', ['invoiceCode_1', 'code_1']],
		['warehouses', ['warehouseCode_1', 'code_1']],
	]

	for (const [collectionName, indexNames] of drops) {
		const collection = connection.collection(collectionName)
		for (const name of indexNames) {
			try {
				await collection.dropIndex(name)
			} catch {
				// index missing or already dropped
			}
		}
	}
}
