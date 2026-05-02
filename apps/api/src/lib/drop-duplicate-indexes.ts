import type { Connection } from 'mongoose'
import { logger } from '@repo/observability'

/** Same logical index (key + options) may exist under different names after migrations / sync issues. */
function indexFingerprint(idx: Record<string, unknown>): string {
	return JSON.stringify({
		key: idx.key,
		unique: Boolean(idx.unique),
		sparse: Boolean(idx.sparse),
		partialFilterExpression: idx.partialFilterExpression ?? null,
		expireAfterSeconds: idx.expireAfterSeconds ?? null,
		collation: idx.collation ?? null,
	})
}

/**
 * Drops duplicate indexes per collection: keeps one index per fingerprint (alphabetically first name),
 * removes the rest. Does not touch `_id_`.
 */
export async function dropDuplicateIndexes(connection: Connection): Promise<void> {
	const db = connection.db
	if (!db) return

	let totalDropped = 0

	const collections = await db.listCollections().toArray()
	for (const { name: collName } of collections) {
		if (collName.startsWith('system.')) continue

		const coll = db.collection(collName)
		let indexes: Record<string, unknown>[]
		try {
			indexes = await coll.indexes()
		} catch {
			continue
		}

		const groups = new Map<string, { name: string }[]>()
		for (const idx of indexes) {
			const idxName = idx.name as string | undefined
			if (!idxName || idxName === '_id_') continue
			const fp = indexFingerprint(idx)
			if (!groups.has(fp)) groups.set(fp, [])
			groups.get(fp)!.push({ name: idxName })
		}

		for (const [, list] of groups) {
			if (list.length <= 1) continue
			const names = list.map((x) => x.name).sort()
			const toDrop = names.slice(1)
			for (const indexName of toDrop) {
				try {
					await coll.dropIndex(indexName)
					totalDropped++
				} catch {
					// race or already removed
				}
			}
		}
	}

	if (totalDropped > 0) {
		logger.info(`Dropped ${totalDropped} duplicate index(es) across collections`)
	}
}
