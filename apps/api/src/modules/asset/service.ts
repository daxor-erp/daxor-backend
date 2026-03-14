import { BaseService } from '../base/service';
import { AssetRepository } from './repository';
import { IAsset } from './model';

export class AssetService extends BaseService<IAsset> {
  constructor(repository: AssetRepository) {
    super(repository);
  }
}
