import { BaseController } from '../base/controller';
import { ApplicantService } from './service';
import { IApplicant } from './model';
import { ApplicantRepository } from './repository';

const applicantRepo = new ApplicantRepository();
const applicantService = new ApplicantService(applicantRepo);

export class ApplicantController extends BaseController<IApplicant> {
  constructor() {
    super(applicantService);
  }
}
