import { BaseController } from '../base/controller';
import { CareerService } from './service';
import { ICareer } from './model';
import { CareerRepository } from './repository';

const careerRepo = new CareerRepository();
const careerService = new CareerService(careerRepo);

export class CareerController extends BaseController<ICareer> {
  constructor() {
    super(careerService);
  }
}
