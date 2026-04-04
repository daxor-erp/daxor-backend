import { MongoBaseRepository, IBaseEntity } from '../base/mongo-repository'
import { FinanceChargeAssessment } from './model'

export interface IFinanceChargeAssessmentDoc extends IBaseEntity {
	assessmentNumber: string
	organizationId: string
	asOfDate: Date
	annualRatePercent: number
	status: string
	lines: any[]
	totalChargeAmount: number
	notes?: string
	postedAt?: Date
	postedBy?: any
	deletedAt?: Date | null
}

export class FinanceChargeAssessmentRepository extends MongoBaseRepository<IFinanceChargeAssessmentDoc> {
	constructor() {
		super(FinanceChargeAssessment as any)
	}
}
