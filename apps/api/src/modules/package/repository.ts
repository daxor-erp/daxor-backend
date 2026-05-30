import { MongoBaseRepository } from '../base/mongo-repository'
import { Package } from './model'

export class PackageRepository extends MongoBaseRepository<any> {
	constructor() {
		super(Package)
	}

	async listActive(): Promise<any[]> {
		return this.model.find({ deletedAt: null }).sort({ createdAt: -1 }).lean().exec()
	}
}
