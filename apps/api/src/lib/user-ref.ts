import { Types } from 'mongoose'

/** Valid Mongo ObjectId string for user refs (createdBy, updatedBy, …), or undefined to omit. */
export function userIdForRef(userId: string | undefined | null): string | undefined {
	if (userId == null) return undefined
	const s = String(userId).trim()
	if (!s || !Types.ObjectId.isValid(s)) return undefined
	return s
}
