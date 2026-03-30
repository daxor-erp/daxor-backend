import { MongoBaseRepository } from '../base/mongo-repository'
import { LeaveApplication, LeaveEnrollment, LeaveReinstatement, LeaveType } from './model'

export class LeaveTypeRepository extends MongoBaseRepository<any> {
	constructor() {
		super(LeaveType)
	}
}

export class LeaveEnrollmentRepository extends MongoBaseRepository<any> {
	constructor() {
		super(LeaveEnrollment)
	}
}

export class LeaveApplicationRepository extends MongoBaseRepository<any> {
	constructor() {
		super(LeaveApplication)
	}
}

export class LeaveReinstatementRepository extends MongoBaseRepository<any> {
	constructor() {
		super(LeaveReinstatement)
	}
}
