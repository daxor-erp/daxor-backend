import { MongoBaseRepository } from '../base/mongo-repository';
import { Career, Recruitment, ICareer, IRecruitment } from './model';

export class CareerRepository extends MongoBaseRepository<ICareer> {
  constructor() {
    super(Career);
  }
}

export class RecruitmentRepository extends MongoBaseRepository<IRecruitment> {
  constructor() {
    super(Recruitment);
  }
}
