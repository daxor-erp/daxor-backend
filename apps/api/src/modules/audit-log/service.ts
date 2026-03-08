import { AuditLogRepository } from './repository'

export class AuditLogService {
	private repository: AuditLogRepository

	constructor() {
		this.repository = new AuditLogRepository()
	}

	async create(data: any): Promise<any> {
		return this.repository.create(data)
	}

	async findById(id: string): Promise<any> {
		return this.repository.findById(id)
	}

	async findWithPagination(filter: any, options: any): Promise<any> {
		return this.repository.findWithPagination(filter, options)
	}
}
