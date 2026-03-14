import { BaseService } from '../base/service';
import { DVSRepository } from './repository';
import { IDVS } from './model';

export class DVSService extends BaseService<IDVS> {
  constructor(repository: DVSRepository) {
    super(repository);
  }
}
