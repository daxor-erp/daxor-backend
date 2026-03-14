import { MongoBaseRepository } from '../base/mongo-repository';
import { EPM, IEPM } from './model';

export class EPMRepository extends MongoBaseRepository<IEPM> {
  constructor() {
    super(EPM);
  }
}
