import { BaseController } from '../base/controller';
import { EPMService } from './service';
import { IEPM } from './model';
import { EPMRepository } from './repository';

const epmRepo = new EPMRepository();
const epmService = new EPMService(epmRepo);

export class EPMController extends BaseController<IEPM> {
  constructor() {
    super(epmService);
  }
}
