import { BaseController } from '../base/controller';
import { DVSService } from './service';
import { IDVS } from './model';
import { DVSRepository } from './repository';

const dvsRepo = new DVSRepository();
const dvsService = new DVSService(dvsRepo);

export class DVSController extends BaseController<IDVS> {
  constructor() {
    super(dvsService);
  }
}
