import { MongoBaseRepository } from '../base/mongo-repository';
import { Applicant, IApplicant } from './model';

export class ApplicantRepository extends MongoBaseRepository<IApplicant> {
  constructor() {
    super(Applicant);
  }
}
