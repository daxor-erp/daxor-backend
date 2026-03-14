import { MongoBaseRepository } from '../base/mongo-repository';
import { Asset, IAsset } from './model';

export class AssetRepository extends MongoBaseRepository<IAsset> {
  constructor() {
    super(Asset);
  }
}
