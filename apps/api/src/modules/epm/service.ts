import { BaseService } from '../base/service';
import { EPMRepository } from './repository';
import { IEPM } from './model';

export class EPMService extends BaseService<IEPM> {
  constructor(repository: EPMRepository) {
    super(repository);
  }
}
