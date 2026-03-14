import { MongoBaseRepository } from '../base/mongo-repository';
import { DVS, IDVS } from './model';

export class DVSRepository extends MongoBaseRepository<IDVS> {
  constructor() {
    super(DVS);
  }
}
