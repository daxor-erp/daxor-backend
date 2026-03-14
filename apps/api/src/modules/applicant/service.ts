import { BaseService } from '../base/service';
import { ApplicantRepository } from './repository';
import { IApplicant } from './model';

export class ApplicantService extends BaseService<IApplicant> {
  constructor(repository: ApplicantRepository) {
    super(repository);
  }
}
