import { BaseService } from '../base/service';
import { CareerRepository, RecruitmentRepository } from './repository';
import { ICareer, IRecruitment } from './model';

export class CareerService extends BaseService<ICareer> {
  constructor(repository: CareerRepository) {
    super(repository);
  }
}

export class RecruitmentService extends BaseService<IRecruitment> {
  constructor(repository: RecruitmentRepository) {
    super(repository);
  }
}
